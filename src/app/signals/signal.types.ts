export interface SignalExercise {
  id: string;
  route: string;
  title: string;
  target: string;
  goal: string;
  steps: string[];
  concepts: string[];
  expected?: string;
  fileHint?: string;
}
