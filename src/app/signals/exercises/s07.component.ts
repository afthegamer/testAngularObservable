import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';

const DATASET = ['Angular', 'Signals', 'RxJS', 'NgRx', 'React', 'Svelte', 'Solid'];

@Component({
  selector: 'app-s07',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s07.component.html',
  styleUrl: './s07.component.scss',
})
export class S07Component {
  readonly searchTerm = signal('');

  private readonly debouncedTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(300)),
    { initialValue: '' }
  );

  readonly results = computed(() => {
    const term = this.debouncedTerm().trim().toLowerCase();
    if (!term) {
      return [];
    }
    return DATASET.filter((item) => item.toLowerCase().includes(term)).slice(0, 5);
  });

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }
}
