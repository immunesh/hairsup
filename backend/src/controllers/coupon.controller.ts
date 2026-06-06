import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export const getAllCoupons = async (
  req: Request,
  res: Response
): Promise<void> => {
  const coupons = await prisma.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    success: true,
    data: coupons,
  });
};

export const createCoupon = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    code,
    type,
    value,
    minOrder,
    maxDiscount,
    usageLimit,
    expiresAt,
  } = req.body;

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      type,
      value,
      minOrder,
      maxDiscount,
      usageLimit,
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : null,
    },
  });

  res.status(201).json({
    success: true,
    data: coupon,
  });
};

export const toggleCouponStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const coupon =
    await prisma.coupon.findUnique({
      where: { id },
    });

  if (!coupon) {
    res.status(404).json({
      success: false,
      message: "Coupon not found",
    });
    return;
  }

  const updated =
    await prisma.coupon.update({
      where: { id },
      data: {
        isActive:
          !coupon.isActive,
      },
    });

  res.json({
    success: true,
    data: updated,
  });
};

export const deleteCoupon = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  await prisma.coupon.delete({
    where: { id },
  });

  res.json({
    success: true,
    message:
      "Coupon deleted successfully",
  });
};