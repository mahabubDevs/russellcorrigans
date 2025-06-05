export interface PriceRequest {
  service: 'lawn' | 'snow';
  area: number;
}

export interface PriceResponse {
  service: 'lawn' | 'snow';
  area: number;
  price: number;
}
