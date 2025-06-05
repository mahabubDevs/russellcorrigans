import { PriceRequest, PriceResponse } from './chooseService.interface';

const lawnPricing = [
  { maxArea: 6000, price: 40 },
  { maxArea: 10000, price: 45 },
  { maxArea: 15000, price: 55 },
  { maxArea: 20000, price: 65 },
  { maxArea: 30000, price: 80 },
  { maxArea: 40000, price: 95 }
];

const snowPricing = [
  { maxArea: 6000, price: 40 },
  { maxArea: 10000, price: 50 },
  { maxArea: 15000, price: 60 },
  { maxArea: 20000, price: 70 },
  { maxArea: 30000, price: 85 },
  { maxArea: 40000, price: 100 },
];

const getPrice = (service: 'lawn' | 'snow', area: number): number => {
  const pricing = service === 'lawn' ? lawnPricing : snowPricing;
  const applicablePrice = pricing.find(p => area <= p.maxArea);
  return applicablePrice ? applicablePrice.price : 0;
};

export const calculatePrice = ({ service, area }: PriceRequest): PriceResponse => {
  const price = getPrice(service, area);
  return { service, area, price };
};
