import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalGrid } from './signal-grid';
import { SignalsCheatsheet } from './signals-cheatsheet';
import { SignalsHero, SignalsHeroCard } from './signals-hero';
import { SignalsNav } from './signals-nav';
import { SIGNAL_EXERCISES } from './signals.list';

@Component({
  selector: 'app-signals-home',
  standalone: true,
  imports: [SignalsHero, SignalGrid, SignalsNav, SignalsCheatsheet],
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
  readonly cards: SignalsHeroCard[] = [
    {
      label: 'Fichiers a modifier',
      code: 'src/app/signals/exercises/s00...s03',
      hint: 'Chaque exercice a un fichier TS + HTML/SCSS associe.',
    },
    {
      label: 'Comment valider',
      hints: [
        'Navigue vers /signals/s00, /signals/s01, /signals/s02, /signals/s03 pour tester.',
        'Observe les signaux dans le template sans AsyncPipe.',
      ],
    },
  ];
  readonly concepts = [
    'signal() pour l etat local (set/update).',
    'computed() pour les derivations synchrones.',
    'effect() pour les side-effects + cleanup.',
    'toSignal() pour consommer un flux RxJS.',
  ];
  readonly tips = [
    'Privilegie les signaux locaux pour l UI; garde RxJS pour les streams reseau.',
    'Nettoie les listeners globaux via DestroyRef ou cleanup effect().',
    'Utilise computed() pour la memoisation en lecture seule.',
  ];
  readonly exercises = SIGNAL_EXERCISES;
}
