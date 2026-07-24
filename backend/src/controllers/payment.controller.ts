import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../db/prisma';
import { AppError } from '../middleware/error.middleware';
import { notifyOrderStatus } from '../utils/notifications';
import { AuthRequest } from '../middleware/auth.middleware';

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    throw new AppError('Missing payment verification details', 400);
  }

  // 1. Verify Razorpay Signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new AppError('Cryptographic signature verification failed. Transaction was not verified.', 400);
  }

  // 2. Fetch order from DB
  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
    include: {
      items: true,
      address: true,
      user: {
        select: { id: true, email: true, firstName: true, emailNotifications: true }
      }
    }
  });

  if (!order) {
    throw new AppError('Order not found in database', 404);
  }

  // If already paid, prevent double execution
  if (order.paymentStatus === 'PAID') {
    res.json({ success: true, message: 'Payment verified and order already confirmed.' });
    return;
  }

  // 3. Update database record in a transaction
  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        paymentId: razorpay_payment_id,
        tracking: {
          create: {
            status: 'CONFIRMED',
            message: 'Payment verified. Order confirmed.'
          }
        }
      }
    }),
    prisma.cartItem.deleteMany({
      where: { userId: order.userId }
    })
  ]);

  // 4. Send Confirmation Notification
  if (order.user) {
    notifyOrderStatus(order.user, order.address, order, 'CONFIRMED');
  }

  res.json({ success: true, message: 'Payment verified and order confirmed.' });
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !secret) {
    res.status(400).json({ success: false, message: 'Webhook signature or secret missing' });
    return;
  }

  // Cryptographic check on the webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature !== signature) {
    res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    return;
  }

  const event = req.body.event;

  if (event === 'order.paid') {
    const rpOrderId = req.body.payload?.order?.entity?.id;
    const rpPaymentId = req.body.payload?.payment?.entity?.id;

    if (!rpOrderId || !rpPaymentId) {
      res.status(400).json({ success: false, message: 'Incomplete webhook payload' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: rpOrderId },
      include: {
        items: true,
        address: true,
        user: { select: { id: true, email: true, firstName: true, emailNotifications: true } }
      }
    });

    if (order && order.paymentStatus !== 'PAID') {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            paymentId: rpPaymentId,
            tracking: {
              create: {
                status: 'CONFIRMED',
                message: 'Payment received via webhook. Order confirmed.'
              }
            }
          }
        }),
        prisma.cartItem.deleteMany({
          where: { userId: order.userId }
        })
      ]);

      if (order.user) {
        notifyOrderStatus(order.user, order.address, order, 'CONFIRMED');
      }
    }
  } else if (event === 'payment.failed') {
    const rpOrderId = req.body.payload?.payment?.entity?.order_id;
    if (rpOrderId) {
      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: rpOrderId }
      });
      if (order && order.paymentStatus !== 'PAID') {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'FAILED',
            tracking: {
              create: {
                status: 'CANCELLED',
                message: 'Payment failed on gateway.'
              }
            }
          }
        });
      }
    }
  }

  res.json({ success: true });
};
