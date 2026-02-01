import { concat, of } from 'rxjs';
import { delay } from 'rxjs/operators';
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
    previewNote: 'Simule le filtrage instantane sans AsyncPipe.',
    previewTimeoutMs: 1800,
    preview: () =>
      concat(
        of('term="" -> 3 actifs').pipe(delay(0)),
        of('term="par" -> 2 correspondances').pipe(delay(400)),
        of('inactifs inclus -> 4 resultats').pipe(delay(900))
      ),
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
    previewNote: 'Montre la persistance localStorage + cleanup.',
    previewTimeoutMs: 1800,
    preview: () =>
      concat(
        of('selection -> alpha (save localStorage)').pipe(delay(0)),
        of('storage event -> beta').pipe(delay(600)),
        of('cleanup -> removeEventListener').pipe(delay(1100))
      ),
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
    previewNote: 'Demonstration de toSignal() depuis un flux interval.',
    previewTimeoutMs: 2000,
    preview: () =>
      concat(
        of('order amount -> 12').pipe(delay(200)),
        of('order amount -> 24').pipe(delay(600)),
        of('total -> 54, complete').pipe(delay(1200))
      ),
  },
  {
    id: 'S04',
    route: '/signals/s04',
    title: 'Linked signals (etat derive)',
    target: 'quantity x unitPrice',
    goal: 'Lier deux signals pour calculer un total derive en computed().',
    steps: [
      'Declare deux signals (quantity, unitPrice) et leur setter.',
      'Expose un computed total = quantity * unitPrice.',
      'Ajoute un bouton reset qui remet une config par defaut.',
    ],
    concepts: ['signal', 'computed', 'form binding'],
    expected: 'Modifier les inputs met a jour total instantanement.',
    fileHint: 'src/app/signals/exercises/s04.component.ts',
    previewNote: 'Relie deux signals et observe le total derive.',
    previewTimeoutMs: 1800,
    preview: () =>
      concat(
        of('1 x 12 = 12').pipe(delay(0)),
        of('3 x 7 = 21').pipe(delay(500)),
        of('reset -> 1 x 12 = 12').pipe(delay(1000))
      ),
  },
  {
    id: 'S05',
    route: '/signals/s05',
    title: 'Mini signalStore (etat global local)',
    target: 'store: { count, theme }',
    goal: 'Centraliser un petit etat global dans un signal unique avec helpers.',
    steps: [
      'Cree un signal pour { count, theme }.',
      'Expose des mutateurs (inc/dec, toggleTheme).',
      'Ajoute un computed pour formater un titre ou un resume.',
    ],
    concepts: ['signal', 'store pattern', 'immutabilite'],
    expected: 'Les composants peuvent lire/modifier le store sans RxJS.',
    fileHint: 'src/app/signals/exercises/s05.component.ts',
    previewNote: 'Store local: increment + toggle theme.',
    previewTimeoutMs: 2000,
    preview: () =>
      concat(
        of('count -> 0, theme -> light').pipe(delay(0)),
        of('count -> 1').pipe(delay(500)),
        of('theme -> dark').pipe(delay(1000))
      ),
  },
  {
    id: 'S06',
    route: '/signals/s06',
    title: 'Chargement async sans RxJS lourd',
    target: 'status/data/error signals',
    goal: 'Gerir un fetch simulé via signal() + timeout + cleanup.',
    steps: [
      'Expose status/data/error en signals.',
      'Cree une methode load() qui simule un fetch (setTimeout).',
      'Ajoute un bouton cancel/refresh pour rejouer sans fuite.',
    ],
    concepts: ['signal', 'async', 'cleanup'],
    expected: 'Les etats loading/success/error sont visibles sans Observable.',
    fileHint: 'src/app/signals/exercises/s06.component.ts',
    previewNote: 'Cycle loading -> success -> refresh.',
    previewTimeoutMs: 2200,
    preview: () =>
      concat(
        of('loading...').pipe(delay(0)),
        of('success -> 3 items').pipe(delay(800)),
        of('refresh -> loading...').pipe(delay(1400))
      ),
  },
  {
    id: 'S07',
    route: '/signals/s07',
    title: 'Debounce sur signal + interop RxJS',
    target: 'searchTerm -> results',
    goal: 'Debouncer une saisie utilisateur (toObservable + debounceTime + toSignal).',
    steps: [
      'Expose searchTerm en signal.',
      'Convertis-le en Observable debounced (300ms) pour simuler une requete.',
      'Reconstruis un signal results pour le template.',
    ],
    concepts: ['toObservable', 'toSignal', 'debounceTime'],
    expected: 'Les requetes ne partent pas a chaque frappe, mais apres debounce.',
    fileHint: 'src/app/signals/exercises/s07.component.ts',
    previewNote: 'Debounce 300ms puis emission des resultats.',
    previewTimeoutMs: 2000,
    preview: () =>
      concat(
        of('type \"ang\"...').pipe(delay(0)),
        of('debounce 300ms').pipe(delay(400)),
        of('2 resultats trouves').pipe(delay(900))
      ),
  },
  {
    id: 'S08',
    route: '/signals/s08',
    title: 'Flux continu type websocket',
    target: 'tickSignal + computed total',
    goal: 'Simuler un flux continu avec toSignal() et reset manuel.',
    steps: [
      'Cree un Observable interval simulant un websocket.',
      'Convertis-le en signal avec toSignal().',
      'Expose un bouton reset pour recreer le flux.',
    ],
    concepts: ['toSignal', 'computed', 'cleanup'],
    expected: 'Les valeurs se cumulent et peuvent etre remises a zero.',
    fileHint: 'src/app/signals/exercises/s08.component.ts',
    previewNote: 'Flux interval + reset signal.',
    previewTimeoutMs: 2200,
    preview: () =>
      concat(
        of('tick -> 1').pipe(delay(200)),
        of('tick -> 2').pipe(delay(600)),
        of('reset -> tick 1').pipe(delay(1200))
      ),
  },
];
