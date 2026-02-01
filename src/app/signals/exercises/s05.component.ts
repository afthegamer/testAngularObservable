import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Theme = 'light' | 'dark';

interface StoreState {
  count: number;
  theme: Theme;
}

@Component({
  selector: 'app-s05',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s05.component.html',
  styleUrl: './s05.component.scss',
})
export class S05Component {
  readonly store = signal<StoreState>({ count: 0, theme: 'light' });

  readonly summary = computed(
    () => `count: ${this.store().count}, theme: ${this.store().theme}`
  );

  inc(): void {
    this.store.update((state) => ({ ...state, count: state.count + 1 }));
  }

  dec(): void {
    this.store.update((state) => ({ ...state, count: Math.max(0, state.count - 1) }));
  }

  toggleTheme(): void {
    this.store.update((state) => ({
      ...state,
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  }

  reset(): void {
    this.store.set({ count: 0, theme: 'light' });
  }
}
