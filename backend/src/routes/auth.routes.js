import { Router } from 'express';
import { body } from 'express-validator';
import { forgotPassword, login, me, register, resetPassword, updateProfile } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  [
    body('firstName').trim().isLength({ min: 2, max: 80 }),
    body('lastName').trim().isLength({ min: 2, max: 80 }),
    body('email').isEmail(),
    body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
    body('phone').optional({ values: 'falsy' }).isLength({ min: 8, max: 40 }),
    handleValidation,
  ],
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty(), handleValidation],
  login
);

router.get('/me', requireAuth, me);

router.put(
  '/profile',
  requireAuth,
  [
    body('firstName').trim().isLength({ min: 2, max: 80 }),
    body('lastName').trim().isLength({ min: 2, max: 80 }),
    body('phone').optional({ values: 'falsy' }).isLength({ min: 8, max: 40 }),
    handleValidation,
  ],
  updateProfile
);

router.post(
  '/forgot-password',
  [body('email').isEmail(), handleValidation],
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
    handleValidation,
  ],
  resetPassword
);

export default router;
