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

const router = Router();
router.use(authenticate);

/* ADMIN */
router.get('/admin/all', getAdminOrders);
router.get('/admin/:id', getAdminOrderById);
router.put('/admin/:id/status', updateOrderStatus);

/* CUSTOMER */
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);


export default router;
