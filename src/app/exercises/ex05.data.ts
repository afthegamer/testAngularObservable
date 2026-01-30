import { concatMap, from, map, timer } from 'rxjs';
import { FlakyStep } from './exercise.types';

export const EX05_FLAKY_REQUEST_SCRIPT: FlakyStep[] = [
  { delayMs: 150, kind: 'timeout' },
  { delayMs: 450, kind: 'server-error', payload: '500 from warehouse API' },
  { delayMs: 800, kind: 'ok', payload: 'Fallback cache ready' },
];

export const ex05FlakyRequest$ = from(EX05_FLAKY_REQUEST_SCRIPT).pipe(
  concatMap((step) => timer(step.delayMs).pipe(map(() => step)))
);
