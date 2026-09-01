import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { loginRules, registerRules } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerRules), authController.register);
router.post('/login', validate(loginRules), authController.login);
router.get('/me', requireAuth, authController.me);

export default router;
