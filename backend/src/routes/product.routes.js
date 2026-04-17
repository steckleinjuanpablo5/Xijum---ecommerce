import { Router } from 'express';
import { body } from 'express-validator';
import { createReview, getCategories, getProductBySlug, getProducts } from '../controllers/product.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post(
  '/:productId/reviews',
  requireAuth,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').trim().isLength({ min: 3, max: 120 }),
    body('comment').trim().isLength({ min: 8, max: 1500 }),
    handleValidation,
  ],
  createReview
);

export default router;
