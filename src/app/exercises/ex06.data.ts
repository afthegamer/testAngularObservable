import { Observable, bufferTime, concatMap, filter, from, map, timer } from 'rxjs';
import { ObservableExercise, OrderEvent } from './exercise.types';

export const EX06_ORDER_EVENTS: OrderEvent[] = [
  { delayMs: 200, amount: 42, status: 'processing' },
  { delayMs: 350, amount: 18, status: 'shipped' },
  { delayMs: 520, amount: 63, status: 'processing' },
  { delayMs: 780, amount: 30, status: 'shipped' },
  { delayMs: 950, amount: 14, status: 'cancelled' },
  { delayMs: 1150, amount: 33, status: 'processing' },
];

export const ex06OrderEvents$ = from(EX06_ORDER_EVENTS).pipe(
  concatMap((event) => timer(event.delayMs).pipe(map(() => event)))
);

export function windowedRevenue$(_events$: Observable<OrderEvent>): Observable<number> {
  return new Observable<number>((subscriber) => {
    subscriber.error(new Error('TODO EX06: implémente windowedRevenue$()'));
    return () => undefined;
  });
}

export const EX06_EXERCISE: ObservableExercise<number> = {
  id: '06',
  title: 'Fenetre glissante de CA',
  target: 'windowedRevenue$(events$)',
  goal:
    'Calculer un cumul glissant des montants sur orderEvents$, avec fenetres chevauchees (600ms) et pas 300ms.',
  steps: [
    'Filtre les annulations, map vers les montants.',
    'BufferTime(600, 300) pour capter les fenetres chevauchees.',
    'Transforme chaque buffer en somme, ignores les buffers vides.',
    'Option: distinctUntilChanged pour ne loguer que les variations.',
  ],
  operators: ['filter', 'map', 'bufferTime', 'reduce', 'distinctUntilChanged'],
  expected: 'Avec ORDER_EVENTS: premiere fenetre ~123, puis ~111, 77, 47 (selon filtrage cancelled).',
  previewNote: 'Bouton = windowedRevenue$(orderEvents$).',
  previewTimeoutMs: 4200,
  preview: () => windowedRevenue$(ex06OrderEvents$),
};
