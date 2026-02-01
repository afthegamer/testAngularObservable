import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Status = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-s06',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s06.component.html',
  styleUrl: './s06.component.scss',
})
export class S06Component implements OnDestroy {
  readonly status = signal<Status>('idle');
  readonly data = signal<string[]>([]);
  readonly error = signal<string | null>(null);

  private timerId: number | null = null;

  load(): void {
    this.clearTimer();
    this.status.set('loading');
    this.error.set(null);
    this.data.set([]);

    this.timerId = Number(
      setTimeout(() => {
        // Toggle success / error randomly to visualiser l'etat.
        const fail = Math.random() < 0.25;
        if (fail) {
          this.status.set('error');
          this.error.set('Simulation erreur reseau');
        } else {
          this.status.set('success');
          this.data.set(['item A', 'item B', 'item C']);
        }
        this.timerId = null;
      }, 650)
    );
  }

  cancel(): void {
    this.clearTimer();
    this.status.set('idle');
    this.error.set(null);
    this.data.set([]);
  }

  refresh(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
