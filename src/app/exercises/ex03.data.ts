import { concatMap, from, map, timer } from 'rxjs';
import { Customer } from './exercise.types';

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
