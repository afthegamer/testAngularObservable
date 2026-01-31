import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  },
})
export class SignalCard {
  readonly exercise = input.required<SignalExercise>();
}
