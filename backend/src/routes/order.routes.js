import { Router } from 'express';
import { getMyOrders } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/mine', requireAuth, getMyOrders);

export default router;
