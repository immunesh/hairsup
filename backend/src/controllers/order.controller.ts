import { Response } from 'express';
import { prisma } from '../db/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HU-${timestamp}-${random}`;
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { addressId, paymentMethod, couponCode, notes } = req.body;

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: req.user!.userId },
  });
  if (!address) throw new AppError('Address not found', 404);

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user!.userId },
    include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
  });
  if (!cartItems.length) throw new AppError('Cart is empty', 400);

  let subtotal = 0;
  const orderItems = cartItems.map((item) => {
    const price = item.product.salePrice || item.product.basePrice;
    subtotal += price * item.quantity;
    return {
      productId: item.productId,
      name: item.product.name,
      image: item.product.images[0]?.url,
      quantity: item.quantity,
      price,
      variant: item.variant,
    };
  });

  let discount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findFirst({ where: { code: couponCode, isActive: true } });
    if (coupon) {
      if (coupon.type === 'PERCENTAGE') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      } else {
        discount = coupon.value;
      }
    }
  }

  const shipping = subtotal > 999 ? 0 : 99;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shipping + tax;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: req.user!.userId,
      addressId,
      paymentMethod,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponCode,
      notes,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      items: { create: orderItems },
      tracking: { create: { status: 'PENDING', message: 'Order placed successfully.' } },
    },
    include: { items: true, address: true, tracking: true },
  });

  await prisma.cartItem.deleteMany({ where: { userId: req.user!.userId } });
  res.status(201).json({ success: true, data: order });
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: req.user!.userId },
      include: { items: true, address: true },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.order.count({ where: { userId: req.user!.userId } }),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }], userId: req.user!.userId },
    include: { items: true, address: true, tracking: { orderBy: { createdAt: 'desc' } } },
  });
  if (!order) throw new AppError('Order not found', 404);
  res.json({ success: true, data: order });
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await prisma.order.findFirst({ where: { id, userId: req.user!.userId } });
  if (!order) throw new AppError('Order not found', 404);
  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage', 400);
  }
  await prisma.order.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      tracking: { create: { status: 'CANCELLED', message: 'Order cancelled by customer.' } },
    },
  });
  res.json({ success: true, message: 'Order cancelled successfully' });
};

export const getAdminOrders = async (
req: AuthRequest,
res: Response
): Promise<void> => {
const orders = await prisma.order.findMany({
include: {
user: {
select: {
firstName: true,
lastName: true,
email: true,
},
},
items: true,
},
orderBy: {
createdAt: "desc",
},
});

res.json({
success: true,
data: orders,
});
};

export const getAdminOrderById = async (
req: AuthRequest,
res: Response
): Promise<void> => {
const { id } = req.params;

const order = await prisma.order.findUnique({
where: {
id,
},
include: {
user: true,
address: true,
items: true,
tracking: {
orderBy: {
createdAt: "desc",
},
},
},
});

if (!order) {
throw new AppError(
"Order not found",
404
);
}

res.json({
success: true,
data: order,
});
};

export const updateOrderStatus = async (
req: AuthRequest,
res: Response
): Promise<void> => {
const { id } = req.params;

const { status } = req.body;

const order =
await prisma.order.update({
where: { id },
data: {
status,
tracking: {
create: {
status,
message: `Order status updated to ${status}`,
},
},
},
});

res.json({
success: true,
data: order,
});
};

