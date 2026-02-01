import { ChangeDetectionStrategy, Component, OnDestroy, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignalExercise } from './signal.types';

@Component({
  selector: 'app-signal-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signal-card.html',
  styleUrl: './signal-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'signal-card',
    '[class.success]': 'successFlash()',
  },
})
export class SignalCard implements OnDestroy {
  readonly exercise = input.required<SignalExercise>();

  readonly logs = signal<string[]>([]);
  readonly running = signal(false);
  readonly successFlash = signal(false);

  readonly hints: Record<string, string> = {
    signal: 'Etat local reactif sans Observable.',
    computed: 'Memoise une valeur derivee des signals utilises.',
    effect: 'Declenche un effet side-effect quand les signals changent.',
    immutabilite: 'Evite la mutation directe, prefere les copies.',
    cleanup: 'Nettoie listeners/timeouts pour eviter les fuites.',
    'toSignal': 'Convertit un Observable en signal automatiquement nettoye.',
    'toObservable': 'Expose un signal sous forme d Observable.',
    debounceTime: 'Delai avant emission pour lisser les saisies.',
    'store pattern': 'Regroupe plusieurs etats dans un signal unique.',
    async: 'Charge des donnees sans RxJS lourd.',
    'RxJS interop': 'Travail mixte RxJS <-> Signals.',
  };

  private previewSubscription: Subscription | null = null;
  private timeoutId: number | null = null;
  private successTimeoutId: number | null = null;

  runPreview(): void {
    const exercise = this.exercise();
    if (!exercise.preview) {
      return;
    }

    this.stopPreview();
    this.clearSuccessFlash();

    const note = exercise.previewNote ?? 'Preview (demo) en cours...';
    const initialLog = [note];
    this.logs.set(initialLog);
    this.running.set(true);

    const snapshot: string[] = [...initialLog];
    let preview$ = exercise.preview();

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

  getHint(concept: string): string {
    return this.hints[concept] ?? '';
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
