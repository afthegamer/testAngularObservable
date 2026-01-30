import { Observable } from 'rxjs';
import { ObservableExercise } from './exercise.types';

export function basicsObservable$(): Observable<string> {
  return new Observable<string>((subscriber) => {
    // TODO: personnalise les emissions pour t'entraîner
    // - change les messages
    // - ajoute un subscriber.error(...) pour tester la gestion d'erreur
    // - modifie les timings ou la logique de teardown
    subscriber.next('sync: bienvenue');

    const timers = [
      setTimeout(() => subscriber.next('async: première emission'), 250),
      setTimeout(() => subscriber.next('async: deuxieme emission'), 550),
      setTimeout(() => subscriber.next('async: dernière emission'), 850),
      setTimeout(() => subscriber.complete(), 1100),
    ];

    return () => timers.forEach(clearTimeout);
  });
}

export const EX00_EXERCISE: ObservableExercise<string> = {
  id: '00',
  title: 'Kickstart : créer un Observable',
  target: 'basicsObservable$()',
  goal: 'Comprendre les callbacks next/complete et le teardown pour des Observables faits maison.',
  steps: [
    'Instancie un Observable en passant une fonction au constructeur.',
    'Emets des valeurs sync puis async (setTimeout) via subscriber.next().',
    'Termine proprement avec subscriber.complete().',
    'Retourne une fonction de nettoyage pour annuler tes timers.',
    'TODO: ajoute une erreur ou change la sequence pour voir le comportement.',
  ],
  operators: ['Observable', 'next', 'complete', 'unsubscribe'],
  expected: 'Une courte séquence de 3 valeurs puis complete.',
  previewNote: 'Bouton = subscribe sur basicsObservable$() avec teardown auto.',
  previewTimeoutMs: 2200,
  preview: () => basicsObservable$(),
};
