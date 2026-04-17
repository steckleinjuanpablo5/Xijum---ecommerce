import { Router } from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getDashboard,
  listOrders,
  listProducts,
  listUsers,
  updateOrderStatus,
  updateProduct,
  updateUserRole
} from '../controllers/admin.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/orders', listOrders);
router.patch(
  '/orders/:id/status',
  [body('status').isIn(['pending', 'payment_pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']), handleValidation],
  updateOrderStatus
);

router.get('/products', listProducts);
router.post(
  '/products',
  [
    body('categorySlug').isString().notEmpty(),
    body('name').trim().isLength({ min: 2, max: 160 }),
    body('slug').trim().isLength({ min: 2, max: 180 }),
    body('sku').trim().isLength({ min: 2, max: 60 }),
    body('description').trim().isLength({ min: 10 }),
    body('shortDescription').trim().isLength({ min: 10, max: 255 }),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 }),
    body('imageName').trim().isLength({ min: 3, max: 120 }),
    handleValidation,
  ],
  createProduct
);
router.put(
  '/products/:id',
  [
    body('categorySlug').isString().notEmpty(),
    body('name').trim().isLength({ min: 2, max: 160 }),
    body('slug').trim().isLength({ min: 2, max: 180 }),
    body('sku').trim().isLength({ min: 2, max: 60 }),
    body('description').trim().isLength({ min: 10 }),
    body('shortDescription').trim().isLength({ min: 10, max: 255 }),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 }),
    body('imageName').trim().isLength({ min: 3, max: 120 }),
    body('isActive').isBoolean(),
    handleValidation,
  ],
  updateProduct
);
router.delete('/products/:id', deleteProduct);

router.get('/users', listUsers);
router.patch(
  '/users/:id/role',
  [body('role').isIn(['customer', 'admin']), handleValidation],
  updateUserRole
);

export default router;
