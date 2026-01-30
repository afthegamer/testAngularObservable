import { firstValueFrom } from 'rxjs';
import { EXERCISE_LIST } from './exercises/exercises.list';

describe('exercises-data', () => {
  it('activeCustomers$ should signal TODO error', async () => {
    await expectPreviewError('01', /TODO EX01/i);
  });

  it('runningRevenue$ should signal TODO error', async () => {
    await expectPreviewError('02', /TODO EX02/i);
  });

  it('windowedRevenue$ should signal TODO error', async () => {
    await expectPreviewError('06', /TODO EX06/i);
  });

  it('packingDashboard$ should signal TODO error', async () => {
    await expectPreviewError('04', /TODO EX04/i);
  });
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
