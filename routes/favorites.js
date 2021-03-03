import { Router } from 'express';

import { add, getAll, remove } from '../controllers/favorites.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.post('/:id', authMiddleware, add);
router.get('/', authMiddleware, getAll);
router.delete('/:id', remove);

export default router;