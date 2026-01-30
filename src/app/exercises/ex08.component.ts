import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ObservableExercise } from './exercise.types';
import { ex08CapacityChanges$, ex08FlakyRequest$, ex08OrderEvents$, ex08PackingEvents$ } from './ex08.data';

@Component({
  selector: 'app-ex08',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ex08.component.html',
  styleUrl: './ex08.component.scss',
})
export class Ex08Component implements OnDestroy {
  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);
  readonly exercise: ObservableExercise = EX08_EXERCISE;

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

function buildControlTower$(): Observable<unknown> {
  // TODO EX08: compose runningRevenue$, packingDashboard$ et etat reseau (timeout/retry/catchError) en un seul flux.
  return new Observable<unknown>((subscriber) => {
    subscriber.error(new Error('TODO EX08: implémente controlTower$ dans ex08.component.ts'));
    return () => undefined;
  });
}

export const EX08_EXERCISE: ObservableExercise<unknown> = {
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
  preview: () => buildControlTower$(),
};
