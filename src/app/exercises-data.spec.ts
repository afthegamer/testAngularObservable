import { firstValueFrom, Observable } from 'rxjs';
import { activeCustomers$ } from './exercises/ex01.data';
import { packingDashboard$ } from './exercises/ex04.data';
import { runningRevenue$ } from './exercises/ex02.data';
import { windowedRevenue$ } from './exercises/ex06.data';

describe('exercises-data', () => {
  it('activeCustomers$ should signal TODO error', async () => {
    await expectError(activeCustomers$(), /TODO EX01/i);
  });

  it('runningRevenue$ should signal TODO error', async () => {
    await expectError(runningRevenue$([] as any), /TODO EX02/i);
  });

  it('windowedRevenue$ should signal TODO error', async () => {
    await expectError(windowedRevenue$([] as any), /TODO EX06/i);
  });

  it('packingDashboard$ should signal TODO error', async () => {
    await expectError(packingDashboard$([] as any, [] as any), /TODO EX04/i);
  });
});

async function expectError<T>(obs$: Observable<T>, regex: RegExp): Promise<void> {
  try {
    await firstValueFrom(obs$);
    throw new Error('Expected an error but observable completed/emitted');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    expect(message).toMatch(regex);
  }
}
