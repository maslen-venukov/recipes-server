import { Router } from 'express';

import { create, getAll, remove } from '../controllers/own.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.post('/', authMiddleware, create);
router.get('/', authMiddleware, getAll);
router.delete('/:id', remove);

export default router;