import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, scan, switchMap, take } from 'rxjs';

const buildTick$ = () =>
  interval(350).pipe(
    take(6),
    scan((acc) => acc + 1, 0)
  );

@Component({
  selector: 'app-s08',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s08.component.html',
  styleUrl: './s08.component.scss',
})
export class S08Component {
  readonly refreshTick = signal(0);

  readonly tickSignal = toSignal(
    toObservable(this.refreshTick).pipe(switchMap(() => buildTick$())),
    { initialValue: 0 }
  );

  readonly formatted = computed(() => `tick: ${this.tickSignal()}`);

  refresh(): void {
    this.refreshTick.update((value) => value + 1);
  }
}
