import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ObservableExercise } from './exercises/exercise.types';
import { ExerciseCard } from './exercise-card';

@Component({
  selector: 'app-exercise-grid',
  standalone: true,
  imports: [ExerciseCard, RouterLink],
  templateUrl: './exercise-grid.html',
  styleUrl: './exercise-grid.scss',
  host: {
    class: 'exercise-grid',
  },
})
export class ExerciseGrid {
  readonly exercises = input.required<ObservableExercise[]>();
}
