import { Router } from "express";

import {
  getAllCoupons,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon,
} from "../controllers/coupon.controller";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

router.use(
  authenticate,
  authorize("ADMIN")
);

router.get(
  "/",
  getAllCoupons
);

router.post(
  "/",
  createCoupon
);

router.patch(
  "/:id/toggle",
  toggleCouponStatus
);

router.delete(
  "/:id",
  deleteCoupon
);

export default router;