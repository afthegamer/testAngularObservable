import { Component, inject } from '@angular/core';
import { DataCheatsheet } from './data-cheatsheet';
import { ExerciseGrid } from './exercise-grid';
import { WorkshopHero } from './workshop-hero';
import { SignalsNav } from './signals/signals-nav';
import { HeroCard, WorkshopService } from './workshop.service';

@Component({
  selector: 'app-workshop-home',
  standalone: true,
  imports: [WorkshopHero, DataCheatsheet, ExerciseGrid, SignalsNav],
  templateUrl: './workshop-home.html',
  styleUrl: './workshop-home.scss',
})
export class WorkshopHome {
  private readonly workshopService = inject(WorkshopService);

  readonly title = this.workshopService.title;
  readonly exercises = this.workshopService.exercises;
  readonly heroCards: HeroCard[] = this.workshopService.heroCards;
  readonly datasets = this.workshopService.datasets;
  readonly tips = this.workshopService.tips;
}
