import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ObservableExercise } from './exercise.types';
import { EX07_CUSTOMERS, EX07_ORDERS } from './ex07.data';

@Component({
  selector: 'app-ex07',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ex07.component.html',
  styleUrl: './ex07.component.scss',
})
export class Ex07Component implements OnDestroy {
  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);
  readonly exercise: ObservableExercise = EX07_EXERCISE;

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

function buildCityLeaderboard$(): Observable<unknown> {
  // TODO EX07: groupBy/mergeMap/reduce sur EX07_CUSTOMERS + EX07_ORDERS pour produire le classement.
  return new Observable<unknown>((subscriber) => {
    subscriber.error(new Error('TODO EX07: implémente cityLeaderboard$ dans ex07.component.ts'));
    return () => undefined;
  });
}

export const EX07_EXERCISE: ObservableExercise<unknown> = {
  id: '07',
  title: 'Leaderboard par ville',
  target: 'cityLeaderboard$()',
  goal:
    'Construire un tableau par ville avec nombre de clients actifs et montants commandes (shipped/processing) classes.',
  steps: [
    'Parts de EX07_CUSTOMERS et EX07_ORDERS en Observables froids (from).',
    'GroupBy sur city, fusionne avec mergeMap + reduce pour accumuler actifs et totaux.',
    'Ignore les commandes annulees, distingue shippedTotal et processingCount.',
    'ToArray puis sort par shippedTotal desc pour afficher le classement.',
  ],
  operators: ['from', 'groupBy', 'mergeMap', 'reduce', 'toArray', 'sort'],
  expected: 'Paris ne devrait pas apparaitre (Samir inactif), Lyon et Bordeaux en tete.',
  previewNote: 'Bouton = cityLeaderboard$().',
  previewTimeoutMs: 3800,
  preview: () => buildCityLeaderboard$(),
};
