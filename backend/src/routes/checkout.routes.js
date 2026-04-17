import { Router } from 'express';
import { body } from 'express-validator';
import { createCheckoutSession, handleStripeWebhook } from '../controllers/checkout.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.post(
  '/create-session',
  requireAuth,
  [
    body('items').isArray({ min: 1 }),
    body('shippingAddress.fullName').trim().isLength({ min: 2, max: 120 }),
    body('shippingAddress.address1').trim().isLength({ min: 5, max: 150 }),
    body('shippingAddress.city').trim().isLength({ min: 2, max: 80 }),
    body('shippingAddress.state').trim().isLength({ min: 2, max: 80 }),
    body('shippingAddress.zip').trim().isLength({ min: 4, max: 15 }),
    body('billingAddress.fullName').trim().isLength({ min: 2, max: 120 }),
    handleValidation,
  ],
  createCheckoutSession
);

router.post('/webhook', handleStripeWebhook);

export default router;
