import { Router } from 'express';
import { getPrice } from './chooseService.controller';

const router = Router();

router.post('/calculate-price', getPrice);

export default router;
