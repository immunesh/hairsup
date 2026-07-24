import { Router } from 'express';
import { verifyPayment, handleWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Secure signature verification (initiated by customer frontend)
router.post('/verify', authenticate, verifyPayment);

// Razorpay webhook endpoint (called directly by Razorpay servers)
router.post('/webhook', handleWebhook);

export default router;
