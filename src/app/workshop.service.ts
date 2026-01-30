import { Injectable } from '@angular/core';
import { ObservableExercise } from './exercises/exercise.types';
import { EXERCISE_LIST, findExerciseById } from './exercises/exercises.list';

export interface HeroCard {
  label: string;
  code?: string;
  hint?: string;
  hints?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class WorkshopService {
  readonly title = 'Atelier Observables';

  readonly heroCards: HeroCard[] = [
    {
      label: 'Fichiers a modifier',
      code: 'src/app/exercises/ex01.component.ts',
      hint: '1 composant par exercice (ex01...ex08), logique/preview TODO a completer',
    },
    {
      label: 'Comment valider',
      hints: [
        'Clique "Rejouer le flux" pour voir les emissions et erreurs dans la carte.',
        'Timeout de preview: 4-5s selon l exercice, configurable dans app.ts.',
      ],
    },
  ];

  readonly datasets = [
    'CUSTOMERS : 4 profils avec ville, tags, active.',
    'ORDERS : montants, status (processing/shipped/cancelled).',
    'ORDER_EVENTS : flux temporel de montants (orderEvents$).',
    'SEARCH_TERMS : frappe utilisateur simulatee (demoSearchTerms$).',
    'PACKING_EVENTS et CAPACITY_STEPS pour un dashboard de colis.',
    'FLAKY_REQUEST_SCRIPT : sequence HTTP avec timeout + erreur serveur.',
  ];

  readonly tips = [
    'Utilise orderEvents$, demoSearchTerms$, packingEvents$, capacityChanges$ et flakyRequest$ deja cables.',
    'Les previews tronquent l abonnement apres la fenetre configuree pour eviter un interval infini.',
    'Tu peux copier-coller les cartes dans tes notes ou brancher un AsyncPipe sur les Observables completes.',
  ];

  readonly exercises: ObservableExercise[] = EXERCISE_LIST;

  getExerciseById(id: string): ObservableExercise | undefined {
    return findExerciseById(id);
  }
}
