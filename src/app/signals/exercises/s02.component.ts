import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const STORAGE_KEY = 'signal-selection';
export const OPTIONS = ['alpha', 'beta', 'gamma', 'delta'] as const;

export type Selection = (typeof OPTIONS)[number];

@Component({
  selector: 'app-s02',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s02.component.html',
  styleUrl: './s02.component.scss',
})
export class S02Component {
  private readonly destroyRef = inject(DestroyRef);

  readonly selection = signal<Selection>(readInitialSelection());
  readonly logs = signal<string[]>([]);

  constructor() {
    effect(() => {
      const value = this.selection();
      localStorage.setItem(STORAGE_KEY, value);
      this.logs.update((entries) => [`selection -> ${value}`, ...entries].slice(0, 6));
    });

    const handler = () => {
      const next = readInitialSelection();
      this.selection.set(next);
      this.logs.update((entries) => [`storage -> ${next}`, ...entries].slice(0, 6));
    };

    window.addEventListener('storage', handler);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('storage', handler);
    });
  }

  readonly options = OPTIONS;

  setSelection(value: Selection): void {
    this.selection.set(value);
  }
}

function readInitialSelection(): Selection {
  const stored = localStorage.getItem(STORAGE_KEY) as Selection | null;
  if (stored && OPTIONS.includes(stored)) {
    return stored;
  }
  return OPTIONS[0];
}
