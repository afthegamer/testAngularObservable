import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ObservableExercise } from './exercise.types';

@Component({
  selector: 'app-ex00',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ex00.component.html',
  styleUrl: './ex00.component.scss',
})
export class Ex00Component implements OnDestroy {
  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);
  readonly exercise: ObservableExercise = EX00_EXERCISE;

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

function buildBasicsObservable$(): Observable<string> {
  return new Observable<string>((subscriber) => {
    /**
     * TODO EX00
     * 1) Découvre les callbacks: subscriber.next(), subscriber.error(), subscriber.complete().
     * 2) Mélange synchro/async: commence par un next sync, puis programme 2-3 emissions avec setTimeout.
     * 3) Gère le cleanup: stocke tes timeouts et retourne une fonction qui les clear pour éviter les fuites.
     * 4) Option: injecte une erreur contrôlée pour voir le flux s’arrêter.
     *
     * Exemple d’étapes possibles (remplace par ton propre code) :
     *   const t1 = setTimeout(() => subscriber.next('tick 1'), 300);
     *   const t2 = setTimeout(() => subscriber.next('tick 2'), 600);
     *   const t3 = setTimeout(() => subscriber.complete(), 900);
     *   return () => [t1, t2, t3].forEach(clearTimeout);
     *
     * Pendant le dev, tu peux aussi:
     *   - essayer subscriber.error(new Error('boom')) pour voir la différence avec complete
     *   - remplacer setTimeout par setInterval et ajouter un unsubscribe propre
     */
    subscriber.error(new Error('TODO EX00: remplace ce bloc par tes emissions et ton teardown'));

    return () => {
      // TODO: nettoie tes timeouts/intervals/ressources ici
    };
  });
}

export const EX00_EXERCISE: ObservableExercise<string> = {
  id: '00',
  title: 'Kickstart : créer un Observable',
  target: 'basicsObservable$()',
  goal: 'Comprendre les callbacks next/complete et le teardown pour des Observables faits maison.',
  steps: [
    'Instancie un Observable en passant une fonction au constructeur.',
    'Emets tes valeurs sync puis async (setTimeout/interval) via subscriber.next().',
    'Termine proprement avec subscriber.complete() ou teste un subscriber.error().',
    'Retourne une fonction de nettoyage (clearTimeout/interval, abort...).',
    'Teste un flux qui se termine, puis un flux qui error, pour voir les comportements.',
  ],
  operators: ['Observable', 'next', 'complete', 'unsubscribe'],
  expected: 'Une courte séquence personnalisée puis complete (ou error selon ton test).',
  previewNote:
    'Bouton = subscribe sur basicsObservable$() (échouera tant que le TODO est présent). Remplace par ta séquence.',
  previewTimeoutMs: 2200,
  preview: () => buildBasicsObservable$(),
};
