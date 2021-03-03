import { Router } from 'express';

import { register, login, auth } from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/auth', authMiddleware, auth);

export default router;