import { concatMap, from, map, timer } from 'rxjs';
import { PackingEvent } from './exercise.types';

export const EX04_PACKING_EVENTS: PackingEvent[] = [
  { delayMs: 0, type: 'queued' },
  { delayMs: 280, type: 'queued' },
  { delayMs: 520, type: 'packed' },
  { delayMs: 780, type: 'queued' },
  { delayMs: 1040, type: 'packed' },
  { delayMs: 1380, type: 'queued' },
];

export const EX04_CAPACITY_STEPS = [
  { delayMs: 0, capacity: 2 },
  { delayMs: 600, capacity: 3 },
  { delayMs: 1200, capacity: 1 },
];

export const ex04PackingEvents$ = from(EX04_PACKING_EVENTS).pipe(
  concatMap((event) => timer(event.delayMs).pipe(map(() => event)))
);

export const ex04CapacityChanges$ = from(EX04_CAPACITY_STEPS).pipe(
  concatMap((step) => timer(step.delayMs).pipe(map(() => step.capacity)))
);
