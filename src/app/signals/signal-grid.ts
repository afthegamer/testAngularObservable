import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SignalCard } from './signal-card';
import { SignalExercise } from './signal.types';

@Component({
  selector: 'app-signal-grid',
  standalone: true,
  imports: [SignalCard],
  templateUrl: './signal-grid.html',
  styleUrl: './signal-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'signal-grid',
  },
})
export class SignalGrid {
  readonly exercises = input.required<SignalExercise[]>();
}
