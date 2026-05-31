import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      phone: true, avatar: true, role: true, createdAt: true,
      addresses: true,
      _count: { select: { orders: true, wishlist: true, reviews: true } },
    },
  });
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { firstName, lastName, phone, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { firstName, lastName, phone, avatar },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true },
  });
  res.json({ success: true, data: user });
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new AppError('User not found', 404);

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new AppError('Current password is incorrect', 400);

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  res.json({ success: true, message: 'Password updated successfully' });
};

export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  const addresses = await prisma.address.findMany({ where: { userId: req.user!.userId } });
  res.json({ success: true, data: addresses });
};

export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { type, fullName, phone, line1, line2, city, state, pincode, country, isDefault } = req.body;

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user!.userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { userId: req.user!.userId, type, fullName, phone, line1, line2, city, state, pincode, country, isDefault },
  });
  res.status(201).json({ success: true, data: address });
};

export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.userId }, data: { isDefault: false } });
  }

  const address = await prisma.address.update({ where: { id, userId: req.user!.userId }, data });
  res.json({ success: true, data: address });
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.address.delete({ where: { id, userId: req.user!.userId } });
  res.json({ success: true, message: 'Address deleted' });
};
