import { WorkshopService } from './workshop.service';

describe('WorkshopService', () => {
  const service = new WorkshopService();

  it('should expose exercises with stable ids', () => {
    expect(service.exercises.length).toBeGreaterThanOrEqual(8);
    const ids = service.exercises.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should find exercise by id', () => {
    const ex01 = service.getExerciseById('01');
    expect(ex01?.target).toContain('activeCustomers');
    expect(service.getExerciseById('unknown')).toBeUndefined();
  });
});
