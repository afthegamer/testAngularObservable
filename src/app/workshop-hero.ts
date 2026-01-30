import { Component, input } from '@angular/core';
import { HeroCard } from './workshop.service';

@Component({
  selector: 'app-workshop-hero',
  standalone: true,
  imports: [],
  templateUrl: './workshop-hero.html',
  styleUrl: './workshop-hero.scss',
  host: {
    class: 'hero',
  },
})
export class WorkshopHero {
  readonly title = input.required<string>();
  readonly cards = input.required<HeroCard[]>();
}
