import { firstValueFrom } from 'rxjs';
import { EXERCISE_LIST } from './exercises/exercises.list';

// Permet d'activer un mode « solutions » sans casser l'atelier pédagogique.
// Lance les tests avec SHOW_SOLUTIONS=true pour ignorer les erreurs TODO attendues.
// Compatible sans types Node en environnement de test.
const SHOW_SOLUTIONS =
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as any).process !== 'undefined' &&
  (globalThis as any).process.env?.SHOW_SOLUTIONS === 'true';

describe('exercises-data', () => {
  const cases = [
    ['01', /TODO EX01/i],
    ['02', /TODO EX02/i],
    ['06', /TODO EX06/i],
    ['04', /TODO EX04/i],
  ] as const;

  if (SHOW_SOLUTIONS) {
    it('solutions mode actif — on saute les controles TODO', () => {
      expect(true).toBe(true);
    });
  } else {
    it.each(cases)('%s preview should signal TODO error', async (id, regex) => {
      await expectPreviewError(id, regex);
    });
  }
});

async function expectPreviewError(id: string, regex: RegExp): Promise<void> {
  const exercise = EXERCISE_LIST.find((ex) => ex.id === id);
  if (!exercise) {
    throw new Error(`Exercise ${id} not found`);
  }

  try {
    const obs$ = exercise.preview();
    await firstValueFrom(obs$);
    throw new Error('Expected an error but observable completed/emitted');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    expect(message).toMatch(regex);
  }
}
