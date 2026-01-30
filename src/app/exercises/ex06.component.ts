import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ObservableExercise } from './exercise.types';
import { ex06OrderEvents$ } from './ex06.data';

@Component({
  selector: 'app-ex06',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ex06.component.html',
  styleUrl: './ex06.component.scss',
})
export class Ex06Component implements OnDestroy {
  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);
  readonly exercise: ObservableExercise = EX06_EXERCISE;

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

function buildWindowedRevenue$(): Observable<number> {
  // TODO EX06: bufferTime ex06OrderEvents$ et somme les montants (ignore cancelled).
  return new Observable<number>((subscriber) => {
    subscriber.error(new Error('TODO EX06: implémente windowedRevenue$ dans ex06.component.ts'));
    return () => undefined;
  });
}

export const EX06_EXERCISE: ObservableExercise<number> = {
  id: '06',
  title: 'Fenetre glissante de CA',
  target: 'windowedRevenue$(events$)',
  goal:
    'Calculer un cumul glissant des montants sur orderEvents$, avec fenetres chevauchees (600ms) et pas 300ms.',
  steps: [
    'Filtre les annulations, map vers les montants.',
    'BufferTime(600, 300) pour capter les fenetres chevauchees.',
    'Transforme chaque buffer en somme, ignores les buffers vides.',
    'Option: distinctUntilChanged pour ne loguer que les variations.',
  ],
  operators: ['filter', 'map', 'bufferTime', 'reduce', 'distinctUntilChanged'],
  expected: 'Avec ORDER_EVENTS: premiere fenetre ~123, puis ~111, 77, 47 (selon filtrage cancelled).',
  previewNote: 'Bouton = windowedRevenue$(orderEvents$).',
  previewTimeoutMs: 4200,
  preview: () => buildWindowedRevenue$(),
};
