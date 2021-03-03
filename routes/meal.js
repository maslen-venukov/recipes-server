import { Router } from 'express';

import { getRandom, getLast, getById } from '../controllers/meal.js';

const router = Router();

router.get('/random', getRandom);
router.get('/last', getLast);
router.get('/:id', getById);

export default router;