import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./workshop-home').then((m) => m.WorkshopHome),
  },
  {
    path: 'exercise/:id',
    loadComponent: () =>
      import('./exercises/exercise-detail-host').then((m) => m.ExerciseDetailHost),
  },
  { path: '**', redirectTo: '' },
];
