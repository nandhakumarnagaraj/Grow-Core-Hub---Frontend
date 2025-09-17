// src/app/shared/components/loading/loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.fullscreen]="fullscreen">
      <div class="loading-content">
        <div class="spinner" [class]="spinnerClass">
          <div class="spinner-inner"></div>
        </div>
        <p class="loading-text" *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .loading-container.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(255, 255, 255, 0.9);
        z-index: 9999;
      }

      .loading-content {
        text-align: center;
      }

      .spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto 1rem;
        position: relative;
      }

      .spinner.large {
        width: 60px;
        height: 60px;
      }

      .spinner.small {
        width: 20px;
        height: 20px;
      }

      .spinner-inner {
        width: 100%;
        height: 100%;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading-text {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class LoadingComponent {
  @Input() message = '';
  @Input() fullscreen = false;
  @Input() spinnerClass = 'medium';
}
