import { ObservableExercise } from './exercise.types';
import { EX00_EXERCISE } from './ex00.data';
import { EX01_EXERCISE } from './ex01.data';
import { EX02_EXERCISE } from './ex02.data';
import { EX03_EXERCISE } from './ex03.data';
import { EX04_EXERCISE } from './ex04.data';
import { EX05_EXERCISE } from './ex05.data';
import { EX06_EXERCISE } from './ex06.data';
import { EX07_EXERCISE } from './ex07.data';
import { EX08_EXERCISE } from './ex08.data';

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
