import { Observable } from 'rxjs';
import { ObservableExercise } from './exercise.types';

export function basicsObservable$(): Observable<string> {
  return new Observable<string>((subscriber) => {
    // TODO: écris ta propre séquence (messages sync/async, erreurs, cleanup).
    // Place ici tes subscriber.next(...) / subscriber.error(...) / subscriber.complete()
    subscriber.error(new Error('TODO: implémente basicsObservable$ et remplace cette erreur'));

    // TODO: retourne ta fonction de teardown (clearTimeout/interval, abortController...)
    return () => undefined;
  });
}

export const EX00_EXERCISE: ObservableExercise<string> = {
  id: '00',
  title: 'Kickstart : créer un Observable',
  target: 'basicsObservable$()',
  goal: 'Comprendre les callbacks next/complete et le teardown pour des Observables faits maison.',
  steps: [
    'Instancie un Observable en passant une fonction au constructeur.',
    'Emets tes valeurs sync puis async (setTimeout/interval) via subscriber.next().',
    'Termine proprement avec subscriber.complete() ou teste un subscriber.error().',
    'Retourne une fonction de nettoyage (clearTimeout/interval, abort...).',
    'Remplace l erreur "TODO: implémente basicsObservable$" par ta propre séquence.',
  ],
  operators: ['Observable', 'next', 'complete', 'unsubscribe'],
  expected: 'Une courte séquence personnalisée puis complete (ou error selon ton test).',
  previewNote: 'Bouton = subscribe sur basicsObservable$() (échouera tant que tu gardes le TODO).',
  previewTimeoutMs: 2200,
  preview: () => basicsObservable$(),
};
