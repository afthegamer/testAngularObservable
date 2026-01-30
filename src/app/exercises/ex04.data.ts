import { Observable, combineLatest, concatMap, from, map, scan, startWith, timer } from 'rxjs';
import { ObservableExercise, PackingDashboard, PackingEvent } from './exercise.types';

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

export function packingDashboard$(
  _events$: Observable<PackingEvent>,
  _capacity$: Observable<number>
): Observable<PackingDashboard> {
  const counts$ = _events$.pipe(
    scan(
      (state, event) => {
        if (event.type === 'queued') {
          return { ...state, backlog: state.backlog + 1 };
        }
        return { ready: state.ready + 1, backlog: Math.max(0, state.backlog - 1) };
      },
      { ready: 0, backlog: 0 }
    ),
    startWith({ ready: 0, backlog: 0 })
  );

  const capacity$ = _capacity$.pipe(startWith(0));

  return combineLatest([counts$, capacity$]).pipe(
    map(([counts, capacity]) => ({ ...counts, capacity }))
  );
}

export const EX04_EXERCISE: ObservableExercise<PackingDashboard> = {
  id: '04',
  title: 'Dashboard combine',
  target: 'packingDashboard$(events$, capacity$)',
  goal:
    'Combiner le flux de colis (queued/packed) avec la capacite disponible pour afficher backlog et ready.',
  steps: [
    'Transforme events$ en deux compteurs: backlog (queued - packed) et ready (packed).',
    'StartWith pour initialiser la capacite avant combineLatest.',
    'Combine capacity$ pour produire { ready, backlog, capacity }.'
  ],
  operators: ['scan', 'map', 'startWith', 'combineLatest'],
  expected: 'Avec les flux fournis: backlog commence a 1, remonte a 2 puis retombe.',
  previewNote: 'Bouton = packingDashboard$(packingEvents$, capacityChanges$).',
  previewTimeoutMs: 5200,
  preview: () => packingDashboard$(ex04PackingEvents$, ex04CapacityChanges$),
};
