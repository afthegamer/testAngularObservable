import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ObservableExercise } from './exercise.types';
import { ex03DemoSearchTerms$ } from './ex03.data';

@Component({
  selector: 'app-ex03',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ex03.component.html',
  styleUrl: './ex03.component.scss',
})
export class Ex03Component implements OnDestroy {
  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);
  readonly exercise: ObservableExercise = EX03_EXERCISE;

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

function buildSearchCustomers$(): Observable<string[]> {
  // TODO EX03: applique debounce/distinctUntilChanged/filter/switchMap sur ex03DemoSearchTerms$ + EX03_CUSTOMERS.
  return new Observable<string[]>((subscriber) => {
    subscriber.error(new Error('TODO EX03: implémente searchCustomers$ dans ex03.component.ts'));
    return () => undefined;
  });
}

export const EX03_EXERCISE: ObservableExercise<string[]> = {
  id: '03',
  title: 'Auto-complete reactive',
  target: 'searchCustomers$(terms$)',
  goal:
    'Rejoue une saisie utilisateur et retourne des suggestions (nom ou ville) en fonction des CUSTOMERS.',
  steps: [
    'Debounce les termes (200-300ms) et ignore les doublons consecutifs.',
    'Ignore les chaines vides, limite a 3 suggestions.',
    'Utilise switchMap sur EX03_CUSTOMERS (filtre name/city incluant le terme en lowercase).',
    'Expose un Observable<string[]> pret pour un AsyncPipe.',
  ],
  operators: ['debounceTime', 'filter', 'distinctUntilChanged', 'switchMap', 'map', 'take'],
  expected: 'Quand terms$ passe par "lea" tu devrais voir Lea et Anais.',
  previewNote: 'Bouton = searchCustomers$(demoSearchTerms$).',
  previewTimeoutMs: 5000,
  preview: () => buildSearchCustomers$(),
};
