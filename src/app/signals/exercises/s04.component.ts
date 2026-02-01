import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-s04',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s04.component.html',
  styleUrl: './s04.component.scss',
})
export class S04Component {
  readonly quantity = signal(1);
  readonly unitPrice = signal(12);

  readonly total = computed(() => this.quantity() * this.unitPrice());

  setQuantity(value: number): void {
    this.quantity.set(normalizePositiveInt(value, 1));
  }

  setUnitPrice(value: number): void {
    this.unitPrice.set(normalizePositiveInt(value, 1));
  }

  reset(): void {
    this.quantity.set(1);
    this.unitPrice.set(12);
  }
}

function normalizePositiveInt(input: number, fallback: number): number {
  const value = Number.isFinite(input) ? Math.max(0, Math.round(input)) : fallback;
  return value;
}
