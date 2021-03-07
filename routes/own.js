import { Router } from 'express';

import { create, getAll, update, remove } from '../controllers/own.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.post('/', authMiddleware, create);
router.get('/', authMiddleware, getAll);
router.patch('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

export default router;