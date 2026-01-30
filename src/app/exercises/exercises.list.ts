import { ObservableExercise } from './exercise.types';
import { EX00_EXERCISE } from './ex00.component';
import { EX01_EXERCISE } from './ex01.component';
import { EX02_EXERCISE } from './ex02.component';
import { EX03_EXERCISE } from './ex03.component';
import { EX04_EXERCISE } from './ex04.component';
import { EX05_EXERCISE } from './ex05.component';
import { EX06_EXERCISE } from './ex06.component';
import { EX07_EXERCISE } from './ex07.component';
import { EX08_EXERCISE } from './ex08.component';

export const EXERCISE_LIST: ObservableExercise[] = [
  EX00_EXERCISE,
  EX01_EXERCISE,
  EX02_EXERCISE,
  EX03_EXERCISE,
  EX04_EXERCISE,
  EX05_EXERCISE,
  EX06_EXERCISE,
  EX07_EXERCISE,
  EX08_EXERCISE,
];

const exerciseById = new Map(EXERCISE_LIST.map((exercise) => [exercise.id, exercise]));

export function findExerciseById(id: string): ObservableExercise | undefined {
  return exerciseById.get(id);
}
