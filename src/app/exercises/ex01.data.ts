import { Observable, filter, from, map, toArray } from 'rxjs';
import { Customer, ObservableExercise, Order } from './exercise.types';

export const EX01_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Lea', city: 'Lyon', active: true, tags: ['b2c', 'vip'] },
  { id: 2, name: 'Tim', city: 'Bordeaux', active: true, tags: ['b2b'] },
  { id: 3, name: 'Samir', city: 'Paris', active: false, tags: ['paused'] },
  { id: 4, name: 'Anais', city: 'Nantes', active: true, tags: ['b2c'] },
];

export const EX01_ORDERS: Order[] = [
  { id: 1, customerId: 1, total: 42, status: 'processing', createdAt: '2024-11-01T09:12:00Z' },
  { id: 2, customerId: 2, total: 18, status: 'shipped', createdAt: '2024-11-01T09:45:00Z' },
  { id: 3, customerId: 1, total: 63, status: 'processing', createdAt: '2024-11-01T10:10:00Z' },
  { id: 4, customerId: 4, total: 30, status: 'shipped', createdAt: '2024-11-01T10:35:00Z' },
  { id: 5, customerId: 2, total: 33, status: 'processing', createdAt: '2024-11-01T11:02:00Z' },
  { id: 6, customerId: 1, total: 27, status: 'cancelled', createdAt: '2024-11-01T11:30:00Z' },
  { id: 7, customerId: 4, total: 15, status: 'processing', createdAt: '2024-11-01T12:05:00Z' },
];

export function activeCustomers$(): Observable<string[]> {
  return from(EX01_CUSTOMERS).pipe(
    filter((customer) => customer.active),
    map((customer) => {
      const orders = EX01_ORDERS.filter(
        (order) => order.customerId === customer.id && order.status !== 'cancelled'
      );
      return { customer, count: orders.length };
    }),
    filter((entry) => entry.count > 0),
    toArray(),
    map((entries) =>
      entries
        .sort((a, b) => b.count - a.count)
        .map((entry) => `${entry.customer.name} (${entry.count} commandes)`)
    )
  );
}

export const EX01_EXERCISE: ObservableExercise<string[]> = {
  id: '01',
  title: 'Flux froid : clients actifs et ordres',
  target: 'activeCustomers$()',
  goal:
    'A partir des donnees locales, emettre un tableau de libelles pour les clients actifs et leur nombre de commandes.',
  steps: [
    'Partir de CUSTOMERS et ORDERS (voir ex01.component.ts).',
    'Filtrer uniquement les clients actifs, ignorer les commandes annulees.',
    'Construire un libelle "Nom (x commandes)" et trier par nombre de commandes decroissant.',
    'Retourner le tout sous forme d Observable froid (emission unique d un tableau).',
  ],
  operators: ['from', 'filter', 'map', 'toArray', 'sort'],
  expected: 'Exemple attendu : ["Lea (3 commandes)", "Tim (2 commandes)", "Anais (2 commandes)"]',
  previewNote: 'Bouton = subscribe sur activeCustomers$().',
  preview: () => activeCustomers$(),
  previewTimeoutMs: 3500,
};
