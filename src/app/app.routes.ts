import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./workshop-home').then((m) => m.WorkshopHome),
  },
  {
    path: 'signals',
    loadComponent: () => import('./signals/signals-home').then((m) => m.SignalsHome),
  },
  {
    path: 'signals/s01',
    loadComponent: () => import('./signals/exercises/s01.component').then((m) => m.S01Component),
  },
  {
    path: 'signals/s02',
    loadComponent: () => import('./signals/exercises/s02.component').then((m) => m.S02Component),
  },
  {
    path: 'signals/s03',
    loadComponent: () => import('./signals/exercises/s03.component').then((m) => m.S03Component),
  },
  {
    path: 'signals/s04',
    loadComponent: () => import('./signals/exercises/s04.component').then((m) => m.S04Component),
  },
  {
    path: 'signals/s05',
    loadComponent: () => import('./signals/exercises/s05.component').then((m) => m.S05Component),
  },
  {
    path: 'signals/s06',
    loadComponent: () => import('./signals/exercises/s06.component').then((m) => m.S06Component),
  },
  {
    path: 'signals/s07',
    loadComponent: () => import('./signals/exercises/s07.component').then((m) => m.S07Component),
  },
  {
    path: 'signals/s08',
    loadComponent: () => import('./signals/exercises/s08.component').then((m) => m.S08Component),
  },
  {
    path: 'exercise/:id',
    loadComponent: () =>
      import('./exercises/exercise-detail-host').then((m) => m.ExerciseDetailHost),
  },
  { path: '**', redirectTo: '' },
];
