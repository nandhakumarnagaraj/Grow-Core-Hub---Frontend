import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" (click)="onCancel()">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header" [class]="'header-' + (data.type || 'info')">
          <h3>{{ data.title }}</h3>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>
        <div class="dialog-body">
          <p>{{ data.message }}</p>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="onCancel()">
            {{ data.cancelText || 'Cancel' }}
          </button>
          <button
            class="btn"
            [class]="'btn-' + (data.type === 'danger' ? 'danger' : 'primary')"
            (click)="onConfirm()"
          >
            {{ data.confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }

      .dialog-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        min-width: 400px;
        max-width: 500px;
        overflow: hidden;
      }

      .dialog-header {
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e1e5e9;
      }

      .header-danger {
        background: #fff5f5;
        border-bottom-color: #feb2b2;
      }

      .header-warning {
        background: #fffbeb;
        border-bottom-color: #fde68a;
      }

      .header-info {
        background: #f0f9ff;
        border-bottom-color: #bae6fd;
      }

      .dialog-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.2rem;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-btn:hover {
        color: #333;
      }

      .dialog-body {
        padding: 1.5rem;
      }

      .dialog-body p {
        margin: 0;
        color: #666;
        line-height: 1.6;
      }

      .dialog-footer {
        padding: 1rem 1.5rem;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        background: #f8f9fa;
        border-top: 1px solid #e1e5e9;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background: #0056b3;
      }

      .btn-danger {
        background: #dc3545;
        color: white;
      }

      .btn-danger:hover {
        background: #c82333;
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background: #545b62;
      }

      @media (max-width: 768px) {
        .dialog-container {
          min-width: auto;
          margin: 1rem;
          max-width: calc(100vw - 2rem);
        }

        .dialog-footer {
          flex-direction: column-reverse;
        }
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(@Inject('data') public data: ConfirmDialogData) {}

  onConfirm(): void {
    // In a real app, this would close the dialog and return true
    console.log('Confirmed');
  }

  onCancel(): void {
    // In a real app, this would close the dialog and return false
    console.log('Cancelled');
  }
}
