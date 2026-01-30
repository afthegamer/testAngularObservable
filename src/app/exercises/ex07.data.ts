import { Observable, filter, from, groupBy, map, mergeMap, reduce, toArray } from 'rxjs';
import { CityBreakdown, Customer, ObservableExercise, Order } from './exercise.types';

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

export function cityLeaderboard$(): Observable<CityBreakdown[]> {
  return new Observable<CityBreakdown[]>((subscriber) => {
    subscriber.error(new Error('TODO EX07: implémente cityLeaderboard$()'));
    return () => undefined;
  });
}

export const EX07_EXERCISE: ObservableExercise<CityBreakdown[]> = {
  id: '07',
  title: 'Leaderboard par ville',
  target: 'cityLeaderboard$()',
  goal:
    'Construire un tableau par ville avec nombre de clients actifs et montants commandes (shipped/processing) classes.',
  steps: [
    'Parts de CUSTOMERS et ORDERS en Observables froids (from).',
    'GroupBy sur city, fusionne avec mergeMap + reduce pour accumuler actifs et totaux.',
    'Ignore les commandes annulees, distingue shippedTotal et processingCount.',
    'ToArray puis sort par shippedTotal desc pour afficher le classement.',
  ],
  operators: ['from', 'groupBy', 'mergeMap', 'reduce', 'toArray', 'sort'],
  expected: 'Paris ne devrait pas apparaitre (Samir inactif), Lyon et Bordeaux en tete.',
  previewNote: 'Bouton = cityLeaderboard$().',
  previewTimeoutMs: 3800,
  preview: () => cityLeaderboard$(),
};
