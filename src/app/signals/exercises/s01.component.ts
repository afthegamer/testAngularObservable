import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Customer {
  id: number;
  name: string;
  city: string;
  active: boolean;
}

const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Lea', city: 'Paris', active: true },
  { id: 2, name: 'Tim', city: 'Lyon', active: true },
  { id: 3, name: 'Samir', city: 'Paris', active: false },
  { id: 4, name: 'Anais', city: 'Bordeaux', active: true },
];

@Component({
  selector: 'app-s01',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s01.component.html',
  styleUrl: './s01.component.scss',
})
export class S01Component {
  readonly searchTerm = signal('');
  readonly showInactive = signal(false);

  readonly filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const includeInactive = this.showInactive();

    return CUSTOMERS.filter((customer) => {
      const matchesTerm =
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.city.toLowerCase().includes(term);
      const matchesStatus = includeInactive ? true : customer.active;
      return matchesTerm && matchesStatus;
    });
  });

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  toggleInactive(): void {
    this.showInactive.update((value) => !value);
  }
}
