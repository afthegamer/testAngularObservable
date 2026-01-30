import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ObservableExercise } from './exercise.types';
import { EX01_CUSTOMERS, EX01_ORDERS } from './ex01.data';

@Component({
  selector: 'app-ex01',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ex01.component.html',
  styleUrl: './ex01.component.scss',
})
export class Ex01Component implements OnDestroy {
  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);
  readonly exercise: ObservableExercise = EX01_EXERCISE;

  private previewSubscription: Subscription | null = null;
  private timeoutId: number | null = null;
  private successTimeoutId: number | null = null;

  runPreview(): void {
    const exercise = this.exercise;

    this.stopPreview();
    this.clearSuccessFlash();

    const initialLog = [exercise.previewNote];
    this.logs.set(initialLog);
    this.running.set(true);

    const snapshot: string[] = [...initialLog];
    let preview$: ReturnType<ObservableExercise['preview']>;
    try {
      preview$ = exercise.preview();
    } catch (error) {
      snapshot.push(`error -> ${this.stringify(error)}`);
      this.logs.set([...snapshot]);
      this.running.set(false);
      return;
    }

    this.previewSubscription = preview$.subscribe({
      next: (value) => {
        snapshot.push(`next -> ${this.stringify(value)}`);
        this.logs.set([...snapshot]);
      },
      error: (error) => {
        snapshot.push(`error -> ${this.stringify(error)}`);
        this.logs.set([...snapshot]);
        this.running.set(false);
      },
      complete: () => {
        snapshot.push('complete');
        this.logs.set([...snapshot]);
        this.running.set(false);
        this.triggerSuccess();
      },
    });

    const timeout = setTimeout(() => {
      if (this.previewSubscription && !this.previewSubscription.closed) {
        snapshot.push('stop -> abonnement coupe apres la fenetre de preview');
        this.previewSubscription.unsubscribe();
        this.logs.set([...snapshot]);
        this.running.set(false);
      }
    }, exercise.previewTimeoutMs ?? 4000);

    this.timeoutId = Number(timeout);
    this.previewSubscription.add(() => {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.stopPreview();
  }

  private stopPreview(): void {
    if (this.previewSubscription && !this.previewSubscription.closed) {
      this.previewSubscription.unsubscribe();
    }
    this.previewSubscription = null;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.running.set(false);
    this.clearSuccessFlash();
  }

  private stringify(value: unknown): string {
    if (value instanceof Error) {
      return value.message;
    }

    if (typeof value === 'string') {
      return value;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  private triggerSuccess(): void {
    this.clearSuccessFlash();
    this.successFlash.set(true);
    const id = setTimeout(() => {
      this.successFlash.set(false);
      this.successTimeoutId = null;
    }, 1200);
    this.successTimeoutId = Number(id);
  }

  private clearSuccessFlash(): void {
    if (this.successTimeoutId !== null) {
      clearTimeout(this.successTimeoutId);
      this.successTimeoutId = null;
    }
    this.successFlash.set(false);
  }
}

function buildActiveCustomers$(): Observable<string[]> {
  // TODO EX01: transforme EX01_CUSTOMERS et EX01_ORDERS en Observable (from/filter/map/toArray...).
  // Filtre les inactifs et les commandes annulées, tri décroissant sur le nombre de commandes.
  return new Observable<string[]>((subscriber) => {
    subscriber.error(new Error('TODO EX01: implémente activeCustomers$ dans ex01.component.ts'));
    return () => undefined;
  });
}

export const EX01_EXERCISE: ObservableExercise<string[]> = {
  id: '01',
  title: 'Flux froid : clients actifs et ordres',
  target: 'activeCustomers$()',
  goal:
    'A partir des donnees locales, emettre un tableau de libelles pour les clients actifs et leur nombre de commandes.',
  steps: [
    'Partir de EX01_CUSTOMERS et EX01_ORDERS (voir ex01.component.ts).',
    'Filtrer uniquement les clients actifs, ignorer les commandes annulees.',
    'Construire un libelle "Nom (x commandes)" et trier par nombre de commandes decroissant.',
    'Retourner le tout sous forme d Observable froid (emission unique d un tableau).',
  ],
  operators: ['from', 'filter', 'map', 'toArray', 'sort'],
  expected: 'Exemple attendu : ["Lea (3 commandes)", "Tim (2 commandes)", "Anais (2 commandes)"]',
  previewNote: 'Bouton = subscribe sur activeCustomers$().',
  preview: () => buildActiveCustomers$(),
  previewTimeoutMs: 3500,
};
