import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { prisma } from '../db/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendEmail } from '../utils/email';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, phone } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  
  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  if (existing) {
    if (existing.isVerified) {
      throw new AppError('Email already registered', 409);
    }
    // If exists but not verified, update and resend verification
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        verificationToken,
        verificationTokenExpiry,
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        verificationToken,
        verificationTokenExpiry,
      },
    });
  }

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const emailText = `Hello ${firstName},\n\nThank you for registering at HairsUp! Please verify your email by clicking the link below:\n\n${verificationLink}\n\nThis link is valid for 24 hours.\n\nBest regards,\nThe HairsUp Team`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #4F46E5; margin-bottom: 20px;">Welcome to HairsUp!</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for registering at HairsUp! Please verify your email address by clicking the button below:</p>
      <p style="margin: 30px 0;">
        <a href="${verificationLink}" style="padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
      <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${verificationLink}</p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">This link is valid for 24 hours. If you did not sign up for a HairsUp account, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #4b5563; font-size: 14px;">Best regards,<br/>The HairsUp Team</p>
    </div>
  `;

  await sendEmail(email, 'Verify your email - HairsUp', emailText, emailHtml);

  const userGmail = process.env.GMAIL_USER;
  const passGmail = process.env.GMAIL_APP_PASSWORD;
  const isSmtpConfigured = userGmail && passGmail && !userGmail.includes('your_gmail_address') && !passGmail.includes('your_16_char_gmail_app_password');

  res.status(201).json({
    success: true,
    message: isSmtpConfigured
      ? 'Verification email sent. Please check your inbox to verify your account.'
      : `[Dev Mode] SMTP not configured. Click to verify: ${verificationLink}`,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);
  if (!user.password) {
    throw new AppError('This account uses Google Sign-In. Please continue with Google.', 401);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Invalid credentials', 401);

  if (!user.isVerified) {
    throw new AppError('Please verify your email address before logging in.', 401);
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, data: { user: userWithoutPassword, accessToken, refreshToken } });
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  const { credential } = req.body;
  if (!credential) throw new AppError('Google credential is required', 400);

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) throw new AppError('Invalid Google token', 401);

  const { sub: googleId, email, given_name, family_name, picture, email_verified } = payload;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        googleId,
        provider: 'google',
        firstName: given_name || 'User',
        lastName: family_name || '',
        avatar: picture,
        isVerified: !!email_verified,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId, avatar: user.avatar || picture },
    });
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, data: { user: userWithoutPassword, accessToken, refreshToken } });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 400);

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) throw new AppError('User not found', 404);

  await prisma.refreshToken.delete({ where: { token: refreshToken } });

  const newAccessToken = generateAccessToken(user.id, user.role);
  const newRefreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({ success: true, data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      phone: true, avatar: true, role: true, createdAt: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const token = req.body.token || req.query.token;
  if (!token || typeof token !== 'string') {
    throw new AppError('Verification token is required', 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
    },
  });

  if (!user || !user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
};

export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.json({
      success: true,
      message: 'If the account exists and is unverified, a new verification link has been sent.',
    });
    return;
  }

  if (user.isVerified) {
    throw new AppError('Email is already verified. Please log in.', 400);
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken,
      verificationTokenExpiry,
    },
  });

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const emailText = `Hello ${user.firstName},\n\nPlease verify your email by clicking the link below:\n\n${verificationLink}\n\nThis link is valid for 24 hours.\n\nBest regards,\nThe HairsUp Team`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #4F46E5; margin-bottom: 20px;">Verify Your Email Address</h2>
      <p>Hello ${user.firstName},</p>
      <p>Please click the button below to verify your email address:</p>
      <p style="margin: 30px 0;">
        <a href="${verificationLink}" style="padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
      <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${verificationLink}</p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">This link is valid for 24 hours. If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #4b5563; font-size: 14px;">Best regards,<br/>The HairsUp Team</p>
    </div>
  `;

  await sendEmail(email, 'Verify your email - HairsUp', emailText, emailHtml);

  res.json({
    success: true,
    message: 'If the account exists and is unverified, a new verification link has been sent.',
  });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.provider === 'google') {
    res.json({
      success: true,
      message: 'If that email address is registered, a password reset link has been sent.',
    });
    return;
  }

  const resetPasswordToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken,
      resetPasswordExpiry,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
  const emailText = `Hello ${user.firstName},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n${resetLink}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.\n\nBest regards,\nThe HairsUp Team`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #4F46E5; margin-bottom: 20px;">Reset Your Password</h2>
      <p>Hello ${user.firstName},</p>
      <p>You requested a password reset. Please click the button below to choose a new password:</p>
      <p style="margin: 30px 0;">
        <a href="${resetLink}" style="padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
      <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${resetLink}</p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #4b5563; font-size: 14px;">Best regards,<br/>The HairsUp Team</p>
    </div>
  `;

  await sendEmail(email, 'Reset your password - HairsUp', emailText, emailHtml);

  const userGmail = process.env.GMAIL_USER;
  const passGmail = process.env.GMAIL_APP_PASSWORD;
  const isSmtpConfigured = userGmail && passGmail && !userGmail.includes('your_gmail_address') && !passGmail.includes('your_16_char_gmail_app_password');

  res.json({
    success: true,
    message: isSmtpConfigured
      ? 'If that email address is registered, a password reset link has been sent.'
      : `[Dev Mode] SMTP not configured. Click to reset: ${resetLink}`,
  });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;
  if (!token || !password) {
    throw new AppError('Token and password are required', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
    },
  });

  if (!user || !user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
};
