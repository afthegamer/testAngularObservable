import { firstValueFrom, from, of, toArray } from 'rxjs';
import { activeCustomers$ } from './exercises/ex01.data';
import { packingDashboard$ } from './exercises/ex04.data';
import { runningRevenue$ } from './exercises/ex02.data';
import { windowedRevenue$ } from './exercises/ex06.data';

describe('exercises-data', () => {
  it('activeCustomers$ should list active customers with order counts sorted desc', async () => {
    const result = await firstValueFrom(activeCustomers$());
    expect(result[0]).toContain('Lea (2');
    expect(result).toContain('Tim (2 commandes)');
    expect(result).not.toContain('Samir');
  });

  it('runningRevenue$ should accumulate amounts ignoring cancelled', async () => {
    const events = [
      { amount: 10, status: 'processing', delayMs: 0 },
      { amount: 5, status: 'cancelled', delayMs: 0 },
      { amount: 8, status: 'shipped', delayMs: 0 },
    ] as const;
    const totals = await firstValueFrom(
      runningRevenue$(from(events)).pipe(toArray())
    );
    expect(totals).toEqual([10, 18]);
  });

  it('windowedRevenue$ should buffer over time and sum amounts', async () => {
    const events = [
      { amount: 10, status: 'processing', delayMs: 0 },
      { amount: 5, status: 'cancelled', delayMs: 0 },
      { amount: 15, status: 'shipped', delayMs: 0 },
    ] as const;

    const seen: number[] = [];
    windowedRevenue$(from(events)).subscribe((value) => seen.push(value));

    await new Promise((resolve) => setTimeout(resolve, 650));
    expect(seen).toEqual([25]);
  });

  it('packingDashboard$ should combine backlog/ready with capacity', async () => {
    const events = [
      { delayMs: 0, type: 'queued' as const },
      { delayMs: 0, type: 'queued' as const },
      { delayMs: 0, type: 'packed' as const },
    ];
    const snapshots = await firstValueFrom(
      packingDashboard$(from(events), of(2)).pipe(toArray())
    );

    const last = snapshots[snapshots.length - 1];
    expect(last).toEqual({ ready: 1, backlog: 1, capacity: 2 });
    expect(snapshots.some((snap) => snap.capacity === 2)).toBe(true);
    expect(snapshots.some((snap) => snap.backlog > 0)).toBe(true);
  });
});
