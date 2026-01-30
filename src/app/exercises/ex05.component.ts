import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ObservableExercise } from './exercise.types';
import { ex05FlakyRequest$ } from './ex05.data';

@Component({
  selector: 'app-ex05',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ex05.component.html',
  styleUrl: './ex05.component.scss',
})
export class Ex05Component implements OnDestroy {
  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);
  readonly exercise: ObservableExercise = EX05_EXERCISE;

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

function buildResilientPing$(): Observable<string> {
  // TODO EX05: applique timeout/retry/catchError sur ex05FlakyRequest$ avec startWith/loading.
  return new Observable<string>((subscriber) => {
    subscriber.error(new Error('TODO EX05: implémente resilientPing$ dans ex05.component.ts'));
    return () => undefined;
  });
}

export const EX05_EXERCISE: ObservableExercise<string> = {
  id: '05',
  title: 'Resilience et erreurs',
  target: 'resilientPing$()',
  goal:
    'Encapsuler flakyRequest$ pour gerer timeout, retries et fallback lisible (ex: message user-friendly).',
  steps: [
    'Demarre par startWith("loading").',
    'Applique timeout ou un retry({ count: 1 }) sur le flux.',
    'Transforme server-error/timeout en catchError avec une valeur de repli.',
    'Option: utilise finalize pour tracer la fin du flux.',
  ],
  operators: ['startWith', 'timeout', 'retry', 'catchError', 'map'],
  expected: 'Un flux propre qui finit sur un message utile meme en cas d erreur.',
  previewNote: 'Bouton = resilientPing$() qui consomme flakyRequest$.',
  previewTimeoutMs: 4200,
  preview: () => buildResilientPing$(),
};
