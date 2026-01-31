import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalGrid } from './signal-grid';
import { SignalsHero } from './signals-hero';
import { SignalsNav } from './signals-nav';
import { SIGNAL_EXERCISES } from './signals.list';

@Component({
  selector: 'app-signals-home',
  standalone: true,
  imports: [SignalsHero, SignalGrid, SignalsNav],
  templateUrl: './signals-home.html',
  styleUrl: './signals-home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsHome {
  readonly title = 'Atelier Signals';
  readonly subtitle =
    'Une serie d exercices pour pratiquer signal(), computed() et effect(), sans toucher aux Observables existants.';
  readonly notes = [
    'Chaque exercice se concentre sur un pattern Signals moderne.',
    'Tu peux implementer ces exercices sans modifier la partie Observables.',
    'Utilise toSignal() pour interop avec RxJS quand c est utile.',
  ];
  readonly exercises = SIGNAL_EXERCISES;
}
