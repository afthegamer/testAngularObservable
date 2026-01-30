import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ObservableExercise } from './exercise.types';
import { ex04CapacityChanges$, ex04PackingEvents$ } from './ex04.data';

@Component({
  selector: 'app-ex04',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ex04.component.html',
  styleUrl: './ex04.component.scss',
})
export class Ex04Component implements OnDestroy {
  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);
  readonly exercise: ObservableExercise = EX04_EXERCISE;

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

function buildPackingDashboard$(): Observable<unknown> {
  // TODO EX04: combine ex04PackingEvents$ et ex04CapacityChanges$ (scan + combineLatest).
  return new Observable<unknown>((subscriber) => {
    subscriber.error(new Error('TODO EX04: implémente packingDashboard$ dans ex04.component.ts'));
    return () => undefined;
  });
}

export const EX04_EXERCISE: ObservableExercise<unknown> = {
  id: '04',
  title: 'Dashboard combine',
  target: 'packingDashboard$(events$, capacity$)',
  goal:
    'Combiner le flux de colis (queued/packed) avec la capacite disponible pour afficher backlog et ready.',
  steps: [
    'Transforme events$ en compteurs backlog/ready via scan.',
    'StartWith pour initialiser la capacite avant combineLatest.',
    'Combine capacity$ pour produire { ready, backlog, capacity }.'
  ],
  operators: ['scan', 'map', 'startWith', 'combineLatest'],
  expected: 'Avec les flux fournis: backlog commence a 1, remonte a 2 puis retombe.',
  previewNote: 'Bouton = packingDashboard$(packingEvents$, capacityChanges$).',
  previewTimeoutMs: 5200,
  preview: () => buildPackingDashboard$(),
};
