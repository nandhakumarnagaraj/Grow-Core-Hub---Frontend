import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="main-layout">
      <app-navbar class="navbar"></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .main-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .navbar {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .main-content {
        flex: 1;
        background: #f8f9fa;
        min-height: calc(100vh - 70px);
      }
    `,
  ],
})
export class MainLayoutComponent {}
