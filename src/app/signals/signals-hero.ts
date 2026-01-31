import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface SignalsHeroCard {
  label: string;
  code?: string;
  hint?: string;
  hints?: string[];
}

@Component({
  selector: 'app-signals-hero',
  standalone: true,
  templateUrl: './signals-hero.html',
  styleUrl: './signals-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsHero {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly notes = input.required<string[]>();
  readonly cards = input.required<SignalsHeroCard[]>();
}
