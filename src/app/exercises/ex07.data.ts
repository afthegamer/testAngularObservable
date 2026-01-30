import { Customer, Order } from './exercise.types';

export const EX07_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Lea', city: 'Lyon', active: true, tags: ['b2c', 'vip'] },
  { id: 2, name: 'Tim', city: 'Bordeaux', active: true, tags: ['b2b'] },
  { id: 3, name: 'Samir', city: 'Paris', active: false, tags: ['paused'] },
  { id: 4, name: 'Anais', city: 'Nantes', active: true, tags: ['b2c'] },
];

export const EX07_ORDERS: Order[] = [
  { id: 1, customerId: 1, total: 42, status: 'processing', createdAt: '2024-11-01T09:12:00Z' },
  { id: 2, customerId: 2, total: 18, status: 'shipped', createdAt: '2024-11-01T09:45:00Z' },
  { id: 3, customerId: 1, total: 63, status: 'processing', createdAt: '2024-11-01T10:10:00Z' },
  { id: 4, customerId: 4, total: 30, status: 'shipped', createdAt: '2024-11-01T10:35:00Z' },
  { id: 5, customerId: 2, total: 33, status: 'processing', createdAt: '2024-11-01T11:02:00Z' },
  { id: 6, customerId: 1, total: 27, status: 'cancelled', createdAt: '2024-11-01T11:30:00Z' },
  { id: 7, customerId: 4, total: 15, status: 'processing', createdAt: '2024-11-01T12:05:00Z' },
];
