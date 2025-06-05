import { Request, Response } from 'express';
import { calculatePrice } from './chooseService.service';
import { PriceRequest } from './chooseService.interface';

export const getPrice = (req: Request, res: Response): void => {
  const { service, area }: PriceRequest = req.body;
  const result = calculatePrice({ service, area });
  res.json(result);
};
