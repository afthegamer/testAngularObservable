import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-s00',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './s00.component.html',
  styleUrl: './s00.component.scss',
})
export class S00Component {
  // TODO S00: remplace par ton etat local (ex: compteur, libelle, etc.).
  readonly count = signal(0);

  // TODO S00: adapte le computed pour formater ou deriver un etat.
  readonly summary = computed(() => `compteur: ${this.count()}`);

  increment(): void {
    this.count.update((value) => value + 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
