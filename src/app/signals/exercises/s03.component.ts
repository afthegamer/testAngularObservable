import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, scan, switchMap, take } from 'rxjs';

const buildOrderEvents$ = () =>
  interval(400).pipe(
    take(6),
    map((index) => ({ amount: (index + 1) * 12 }))
  );

@Component({
  selector: 'app-s03',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s03.component.html',
  styleUrl: './s03.component.scss',
})
export class S03Component {
  readonly refreshTick = signal(0);

  readonly runningTotal = toSignal(
    toObservable(this.refreshTick).pipe(
      switchMap(() => buildOrderEvents$()),
      scan((total, event) => total + event.amount, 0)
    ),
    { initialValue: 0 }
  );

  readonly formattedTotal = computed(() => `€ ${this.runningTotal()}`);

  refresh(): void {
    this.refreshTick.update((value) => value + 1);
  }
}
