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
    path: 'signals/s00',
    loadComponent: () => import('./signals/exercises/s00.component').then((m) => m.S00Component),
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
    path: 'exercise/:id',
    loadComponent: () =>
      import('./exercises/exercise-detail-host').then((m) => m.ExerciseDetailHost),
  },
  { path: '**', redirectTo: '' },
];
