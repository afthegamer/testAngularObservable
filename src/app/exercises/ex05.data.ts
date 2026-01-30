import { Observable, catchError, concatMap, from, map, of, retry, startWith, timeout, timer } from 'rxjs';
import { FlakyStep, ObservableExercise } from './exercise.types';

export const EX05_FLAKY_REQUEST_SCRIPT: FlakyStep[] = [
  { delayMs: 150, kind: 'timeout' },
  { delayMs: 450, kind: 'server-error', payload: '500 from warehouse API' },
  { delayMs: 800, kind: 'ok', payload: 'Fallback cache ready' },
];

export const ex05FlakyRequest$ = from(EX05_FLAKY_REQUEST_SCRIPT).pipe(
  concatMap((step) => timer(step.delayMs).pipe(map(() => step)))
);

export function resilientPing$(): Observable<string> {
  return ex05FlakyRequest$.pipe(
    timeout({ each: 500 }),
    retry({ count: 1 }),
    map((step) => {
      if (step.kind === 'ok') {
        return step.payload ?? 'ok';
      }
      if (step.kind === 'server-error') {
        throw new Error(step.payload ?? 'server-error');
      }
      if (step.kind === 'timeout') {
        throw new Error('timeout');
      }
      return step.kind;
    }),
    startWith('loading'),
    catchError((error) => of(`fallback: ${error instanceof Error ? error.message : 'error'}`))
  );
}

export const EX05_EXERCISE: ObservableExercise<string> = {
  id: '05',
  title: 'Resilience et erreurs',
  target: 'resilientPing$()',
  goal:
    'Encapsuler flakyRequest$ pour gerer timeout, retries et fallback lisible (ex: message user-friendly).',
  steps: [
    'Demarre par startWith("loading").',
    'Applique timeout ou un retry({ count: 1 }) sur le flux.',
    'Transforme server-error/timeout en catchError avec une valeur de repli.',
    'Option: utilise finalize pour tracer la fin du flux.',
  ],
  operators: ['startWith', 'timeout', 'retry', 'catchError', 'map'],
  expected: 'Un flux propre qui finit sur un message utile meme en cas d erreur.',
  previewNote: 'Bouton = resilientPing$() qui consomme flakyRequest$.',
  previewTimeoutMs: 4200,
  preview: () => resilientPing$(),
};
