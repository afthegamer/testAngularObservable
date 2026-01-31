import { SignalExercise } from './signal.types';

export const SIGNAL_EXERCISES: SignalExercise[] = [
  {
    id: 'S01',
    route: '/signals/s01',
    title: 'Etat local avec signal() et computed()',
    target: 'customerFilters()',
    goal:
      'Creer un etat local pour des filtres clients et derivations avec computed() sans RxJS.',
    steps: [
      'Declare un signal pour le filtre (texte + statut actif).',
      'Declare un computed() qui derive la liste filtree a partir des donnees locales.',
      'Expose un setter de signal pour modifier le filtre depuis le template.',
    ],
    concepts: ['signal', 'computed', 'immutabilite'],
    expected: 'La liste se filtre instantanement sans abonnement manuel.',
    fileHint: 'src/app/signals/exercises/s01.component.ts',
  },
  {
    id: 'S02',
    route: '/signals/s02',
    title: 'Effets et nettoyage avec effect()',
    target: 'syncSelectionEffect()',
    goal:
      'Brancher un effect() pour synchroniser une selection avec localStorage et nettoyer proprement.',
    steps: [
      'Cree un signal selectionId avec une valeur initiale.',
      'Utilise effect() pour persister selectionId dans localStorage.',
      'Retourne une fonction de cleanup pour annuler un listener eventuel.',
    ],
    concepts: ['signal', 'effect', 'cleanup'],
    expected: 'La selection est persistee sans fuite memoire.',
    fileHint: 'src/app/signals/exercises/s02.component.ts',
  },
  {
    id: 'S03',
    route: '/signals/s03',
    title: 'Interop RxJS -> Signals',
    target: 'toSignal(orderEvents$)',
    goal:
      'Convertir un flux RxJS en signal pour l utiliser dans un template sans AsyncPipe.',
    steps: [
      'Utilise toSignal() avec une valeur initiale.',
      'Expose un computed() pour formatter l etat derive.',
      'Ajoute un bouton pour reinitialiser l etat si besoin.',
    ],
    concepts: ['toSignal', 'computed', 'RxJS interop'],
    expected: 'Le template affiche un total mis a jour automatiquement.',
    fileHint: 'src/app/signals/exercises/s03.component.ts',
  },
];
