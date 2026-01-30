import { bufferTime, concatMap, filter, from, map, timer } from 'rxjs';
import { OrderEvent } from './exercise.types';

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
