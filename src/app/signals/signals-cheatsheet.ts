import { Component, input } from '@angular/core';

@Component({
  selector: 'app-signals-cheatsheet',
  standalone: true,
  templateUrl: './signals-cheatsheet.html',
  styleUrl: './signals-cheatsheet.scss',
  host: {
    class: 'signals-section',
  },
})
export class SignalsCheatsheet {
  readonly concepts = input.required<string[]>();
  readonly tips = input.required<string[]>();
}
