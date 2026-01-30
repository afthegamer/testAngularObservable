import { Component, input } from '@angular/core';

@Component({
  selector: 'app-data-cheatsheet',
  standalone: true,
  imports: [],
  templateUrl: './data-cheatsheet.html',
  styleUrl: './data-cheatsheet.scss',
  host: {
    class: 'data-section',
  },
})
export class DataCheatsheet {
  readonly datasets = input.required<string[]>();
  readonly tips = input.required<string[]>();
}
