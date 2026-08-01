import nodemailer from 'nodemailer';

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  console.log(`\n==================================================`);
  console.log(`[EMAIL UTILITY] To: ${to}`);
  console.log(`[EMAIL UTILITY] Subject: ${subject}`);
  console.log(`[EMAIL UTILITY] Text content:\n${text}`);
  console.log(`==================================================\n`);

  if (!user || !pass || user.includes('your_gmail_address') || pass.includes('your_16_char_gmail_app_password')) {
    console.log(`[EMAIL UTILITY] GMAIL_USER or GMAIL_APP_PASSWORD is not set or contains default placeholder. Logging email to console only.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"HairsUp" <${user}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`[EMAIL UTILITY] Email sent successfully via SMTP to ${to}`);
  } catch (error) {
    console.error(`[EMAIL UTILITY] Failed to send email via SMTP:`, error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};
