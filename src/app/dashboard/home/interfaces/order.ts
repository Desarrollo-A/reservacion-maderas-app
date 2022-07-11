export interface Order {
  name: string;
  price: string;
  status: 'ready' | 'pending' | 'warn';
  timestamp: string;
}
