import {
  Observable,
  catchError,
  combineLatest,
  concatMap,
  filter,
  from,
  map,
  retry,
  scan,
  share,
  shareReplay,
  startWith,
  timeout,
  timer,
  of
} from 'rxjs';
import {
  ControlTowerSnapshot,
  FlakyStep,
  ObservableExercise,
  OrderEvent,
  PackingDashboard,
  PackingEvent
} from './exercise.types';

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

export function runningRevenue$(_events$: Observable<OrderEvent>): Observable<number> {
  return new Observable<number>((subscriber) => {
    subscriber.error(new Error('TODO EX08: implémente runningRevenue$()'));
    return () => undefined;
  });
}

export function packingDashboard$(
  _events$: Observable<PackingEvent>,
  _capacity$: Observable<number>
): Observable<PackingDashboard> {
  return new Observable<PackingDashboard>((subscriber) => {
    subscriber.error(new Error('TODO EX08: implémente packingDashboard$()'));
    return () => undefined;
  });
}

export function controlTower$(
  _events$: Observable<OrderEvent>,
  _packing$: Observable<PackingEvent>,
  _capacity$: Observable<number>,
  _flaky$: Observable<FlakyStep>
): Observable<ControlTowerSnapshot> {
  return new Observable<ControlTowerSnapshot>((subscriber) => {
    subscriber.error(new Error('TODO EX08: implémente controlTower$()'));
    return () => undefined;
  });
}

export const EX08_EXERCISE: ObservableExercise<ControlTowerSnapshot> = {
  id: '08',
  title: 'Tour de controle temps reel',
  target: 'controlTower$(events$, packing$, capacity$, flaky$)',
  goal:
    'Consolider revenus cumulés, backlog colis/capacite et statut reseau dans un seul Observable partage.',
  steps: [
    'Partage orderEvents$ pour produire un cumul (runningRevenue$) sans double abonnement.',
    'Reutilise packingDashboard$ pour backlog/ready/capacity.',
    'CombineLatest avec un flux derive de flakyRequest$ traite (timeout/retry/catchError) pour l etat service.',
    'ShareReplay(1) pour eviter de relancer la sequence HTTP a chaque nouveau subscriber.',
  ],
  operators: ['share', 'shareReplay', 'combineLatest', 'withLatestFrom', 'map'],
  expected: 'Un flux d objets { revenue, backlog, ready, capacity, service } se met a jour en live.',
  previewNote: 'Bouton = controlTower$(orderEvents$, packingEvents$, capacityChanges$, flakyRequest$).',
  previewTimeoutMs: 5200,
  preview: () =>
    controlTower$(ex08OrderEvents$, ex08PackingEvents$, ex08CapacityChanges$, ex08FlakyRequest$),
};
