import {
  Observable,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  map,
  switchMap,
  timer,
  toArray
} from 'rxjs';
import { Customer, ObservableExercise } from './exercise.types';

export const EX03_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Lea', city: 'Lyon', active: true, tags: ['b2c', 'vip'] },
  { id: 2, name: 'Tim', city: 'Bordeaux', active: true, tags: ['b2b'] },
  { id: 3, name: 'Samir', city: 'Paris', active: false, tags: ['paused'] },
  { id: 4, name: 'Anais', city: 'Nantes', active: true, tags: ['b2c'] },
];

export const EX03_SEARCH_TERMS = ['l', 'le', 'lea', 'lea', 'lea ', 'lea', 'lean', 'lea', 'le', ''];

export const ex03DemoSearchTerms$ = from(EX03_SEARCH_TERMS).pipe(
  concatMap((term, index) => timer(index * 180).pipe(map(() => term)))
);

export function searchCustomers$(terms$: Observable<string>): Observable<string[]> {
  return terms$.pipe(
    debounceTime(250),
    map((term) => term.trim().toLowerCase()),
    distinctUntilChanged(),
    filter((term) => term.length > 0),
    switchMap((term) =>
      from(EX03_CUSTOMERS).pipe(
        filter(
          (customer) =>
            customer.name.toLowerCase().includes(term) ||
            customer.city.toLowerCase().includes(term)
        ),
        map((customer) => customer.name),
        toArray(),
        map((names) => names.slice(0, 3))
      )
    )
  );
}

export const EX03_EXERCISE: ObservableExercise<string[]> = {
  id: '03',
  title: 'Auto-complete reactive',
  target: 'searchCustomers$(terms$)',
  goal:
    'Rejoue une saisie utilisateur et retourne des suggestions (nom ou ville) en fonction des CUSTOMERS.',
  steps: [
    'Debounce les termes (200-300ms) et ignore les doublons consecutifs.',
    'Ignore les chaines vides, limite a 3 suggestions.',
    'Utilise switchMap sur CUSTOMERS (filtre name/city incluant le terme en lowercase).',
    'Expose un Observable<string[]> pret pour un AsyncPipe.',
  ],
  operators: ['debounceTime', 'filter', 'distinctUntilChanged', 'switchMap', 'map', 'take'],
  expected: 'Quand terms$ passe par "lea" tu devrais voir Lea et Anais.',
  previewNote: 'Bouton = searchCustomers$(demoSearchTerms$).',
  previewTimeoutMs: 5000,
  preview: () => searchCustomers$(ex03DemoSearchTerms$),
};
