import { NgComponentOutlet, NgIf } from '@angular/common';
import { Component, Type, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-exercise-detail-host',
  standalone: true,
  imports: [NgIf, NgComponentOutlet, RouterLink],
  template: `
    <ng-container *ngIf="component; else missing">
      <ng-container *ngComponentOutlet="component"></ng-container>
    </ng-container>
    <ng-template #missing>
      <div class="page">
        <a class="back-link" routerLink="/">← Retour à la liste</a>
        <div class="detail-card missing">
          <p class="label">Exercice introuvable</p>
          <p class="hint">Identifiant non reconnu.</p>
        </div>
      </div>
    </ng-template>
  `,
})
export class ExerciseDetailHost {
  private readonly route = inject(ActivatedRoute);

  component: Type<unknown> | null = null;

  constructor() {
    this.pickComponent();
  }

  private async pickComponent(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.component = await this.lazyImportById(id);
  }

  private lazyImportById(id: string): Promise<Type<unknown> | null> {
    switch (id) {
      case '01':
        return import('./ex01.component').then((m) => m.Ex01Component);
      case '02':
        return import('./ex02.component').then((m) => m.Ex02Component);
      case '03':
        return import('./ex03.component').then((m) => m.Ex03Component);
      case '04':
        return import('./ex04.component').then((m) => m.Ex04Component);
      case '05':
        return import('./ex05.component').then((m) => m.Ex05Component);
      case '06':
        return import('./ex06.component').then((m) => m.Ex06Component);
      case '07':
        return import('./ex07.component').then((m) => m.Ex07Component);
      case '08':
        return import('./ex08.component').then((m) => m.Ex08Component);
      default:
        return Promise.resolve(null);
    }
  }
}
