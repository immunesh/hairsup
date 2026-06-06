import { Router } from 'express';
import {
createOrder,
getOrders,
getOrderById,
cancelOrder,
getAdminOrders,
getAdminOrderById,
updateOrderStatus,
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
  authorize,
} from "../middleware/auth.middleware";
const router = Router();
router.use(authenticate);

/* ADMIN */
router.get(
  "/admin/all",
  authorize("ADMIN"),
  getAdminOrders
);

router.get(
  "/admin/:id",
  authorize("ADMIN"),
  getAdminOrderById
);

router.put(
  "/admin/:id/status",
  authorize("ADMIN"),
  updateOrderStatus
);
/* CUSTOMER */
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);


export default router;
