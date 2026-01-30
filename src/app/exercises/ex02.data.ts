import { Observable, filter, from, map, scan, concatMap, timer } from 'rxjs';
import { ObservableExercise, OrderEvent } from './exercise.types';

export const EX02_ORDER_EVENTS: OrderEvent[] = [
  { delayMs: 200, amount: 42, status: 'processing' },
  { delayMs: 350, amount: 18, status: 'shipped' },
  { delayMs: 520, amount: 63, status: 'processing' },
  { delayMs: 780, amount: 30, status: 'shipped' },
  { delayMs: 950, amount: 14, status: 'cancelled' },
  { delayMs: 1150, amount: 33, status: 'processing' },
];

export const ex02OrderEvents$ = from(EX02_ORDER_EVENTS).pipe(
  concatMap((event) => timer(event.delayMs).pipe(map(() => event)))
);

export function runningRevenue$(events$: Observable<OrderEvent>): Observable<number> {
  return events$.pipe(
    filter((event) => event.status !== 'cancelled'),
    map((event) => event.amount),
    scan((acc, amount) => acc + amount, 0)
  );
}

export const EX02_EXERCISE: ObservableExercise<number> = {
  id: '02',
  title: 'Cumul en temps reel',
  target: 'runningRevenue$(events$)',
  goal: 'Cumuler les montants des evenements de commande en ignorant les annulations et emettre chaque etape.',
  steps: [
    'Utilise orderEvents$ comme source, filtre status "cancelled".',
    'Map sur amount, puis scan pour produire un cumul progressif.',
    'Ajoute un startWith(0) si tu veux voir le point de depart.',
    'Option: utilise tap pour logger pendant le dev.',
  ],
  operators: ['filter', 'map', 'scan', 'startWith'],
  expected: 'Avec ORDER_EVENTS : 42 -> 60 -> 123 -> 153.',
  previewNote: 'Bouton = runningRevenue$(orderEvents$).',
  preview: () => runningRevenue$(ex02OrderEvents$),
};
