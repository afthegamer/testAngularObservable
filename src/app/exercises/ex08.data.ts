import { concatMap, from, map, timer } from 'rxjs';
import { FlakyStep, OrderEvent, PackingEvent } from './exercise.types';

export const EX08_ORDER_EVENTS: OrderEvent[] = [
  { delayMs: 200, amount: 42, status: 'processing' },
  { delayMs: 350, amount: 18, status: 'shipped' },
  { delayMs: 520, amount: 63, status: 'processing' },
  { delayMs: 780, amount: 30, status: 'shipped' },
  { delayMs: 950, amount: 14, status: 'cancelled' },
  { delayMs: 1150, amount: 33, status: 'processing' },
];

export const EX08_PACKING_EVENTS: PackingEvent[] = [
  { delayMs: 0, type: 'queued' },
  { delayMs: 280, type: 'queued' },
  { delayMs: 520, type: 'packed' },
  { delayMs: 780, type: 'queued' },
  { delayMs: 1040, type: 'packed' },
  { delayMs: 1380, type: 'queued' },
];

export const EX08_CAPACITY_STEPS = [
  { delayMs: 0, capacity: 2 },
  { delayMs: 600, capacity: 3 },
  { delayMs: 1200, capacity: 1 },
];

export const EX08_FLAKY_REQUEST_SCRIPT: FlakyStep[] = [
  { delayMs: 150, kind: 'timeout' },
  { delayMs: 450, kind: 'server-error', payload: '500 from warehouse API' },
  { delayMs: 800, kind: 'ok', payload: 'Fallback cache ready' },
];

export const ex08OrderEvents$ = from(EX08_ORDER_EVENTS).pipe(
  concatMap((event) => timer(event.delayMs).pipe(map(() => event)))
);

export const ex08PackingEvents$ = from(EX08_PACKING_EVENTS).pipe(
  concatMap((event) => timer(event.delayMs).pipe(map(() => event)))
);

export const ex08CapacityChanges$ = from(EX08_CAPACITY_STEPS).pipe(
  concatMap((step) => timer(step.delayMs).pipe(map(() => step.capacity)))
);

export const ex08FlakyRequest$ = from(EX08_FLAKY_REQUEST_SCRIPT).pipe(
  concatMap((step) => timer(step.delayMs).pipe(map(() => step)))
);
