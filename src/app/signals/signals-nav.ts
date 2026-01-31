import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-signals-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './signals-nav.html',
  styleUrl: './signals-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsNav {}
