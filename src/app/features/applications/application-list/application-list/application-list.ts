// src/app/features/applications/application-list/application-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../../../../core/services/application-service';
import { Application } from '../../../../core/models/application';
import { ApplicationStatus } from '../../../../core/models/application-status';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="applications-container">
      <div class="applications-header">
        <h1>My Applications</h1>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ applications.length }}</span>
            <span class="stat-label">Total Applications</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getStatusCount('ACTIVE') }}</span>
            <span class="stat-label">Active Projects</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getStatusCount('COMPLETED') }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <!-- Applications Grid -->
      <div class="applications-grid" *ngIf="applications.length > 0; else noApplications">
        <div
          class="application-card"
          *ngFor="let application of applications; trackBy: trackByApplicationId"
        >
          <div class="card-header">
            <div class="project-info">
              <h3>{{ application.projectTitle || 'Project #' + application.projectId }}</h3>
              <span class="application-id">App ID: {{ application.id }}</span>
            </div>
            <div class="status-container">
              <span
                class="status-badge"
                [class]="'status-' + application.status.toLowerCase().replace('_', '-')"
              >
                {{ formatStatus(application.status) }}
              </span>
            </div>
          </div>

          <div class="card-content">
            <div class="application-details">
              <div class="detail-row">
                <span class="detail-label">Applied On:</span>
                <span class="detail-value">{{ application.createdAt | date : 'medium' }}</span>
              </div>
              <div class="detail-row" *ngIf="application.signedAgreementAt">
                <span class="detail-label">Agreement Signed:</span>
                <span class="detail-value">{{
                  application.signedAgreementAt | date : 'medium'
                }}</span>
              </div>
              <div class="detail-row" *ngIf="application.assessmentId">
                <span class="detail-label">Assessment ID:</span>
                <span class="detail-value">#{{ application.assessmentId }}</span>
              </div>
            </div>

            <!-- Status-specific content -->
            <div class="status-content" [ngSwitch]="application.status">
              <!-- Applied Status -->
              <div *ngSwitchCase="ApplicationStatus.APPLIED" class="status-info info">
                <div class="status-message">
                  <span class="icon">⏳</span>
                  <p>
                    Your application is under review. You'll be notified once the assessment is
                    ready.
                  </p>
                </div>
              </div>

              <!-- Assessment In Progress -->
              <div
                *ngSwitchCase="ApplicationStatus.ASSESSMENT_IN_PROGRESS"
                class="status-info warning"
              >
                <div class="status-message">
                  <span class="icon">📝</span>
                  <p>Assessment is available. Complete it to proceed with your application.</p>
                </div>
                <div class="action-buttons">
                  <button
                    class="btn btn-primary"
                    [routerLink]="['/assessments', application.assessmentId]"
                    *ngIf="application.assessmentId"
                  >
                    Take Assessment
                  </button>
                </div>
              </div>

              <!-- Assessment Completed -->
              <div *ngSwitchCase="ApplicationStatus.ASSESSMENT_COMPLETED" class="status-info info">
                <div class="status-message">
                  <span class="icon">✅</span>
                  <p>Assessment completed successfully. Waiting for results.</p>
                </div>
              </div>

              <!-- Eligible -->
              <div *ngSwitchCase="ApplicationStatus.ELIGIBLE" class="status-info success">
                <div class="status-message">
                  <span class="icon">🎉</span>
                  <p>
                    Congratulations! You're eligible for this project. Please sign the agreement to
                    proceed.
                  </p>
                </div>
                <div class="action-buttons">
                  <button
                    class="btn btn-success"
                    (click)="signAgreement(application.id)"
                    [disabled]="signingAgreement"
                  >
                    {{ signingAgreement ? 'Signing...' : 'Sign Agreement' }}
                  </button>
                </div>
              </div>

              <!-- Pending Verification -->
              <div
                *ngSwitchCase="ApplicationStatus.PENDING_VERIFICATION"
                class="status-info warning"
              >
                <div class="status-message">
                  <span class="icon">🔍</span>
                  <p>Agreement signed. Your application is under final verification.</p>
                </div>
              </div>

              <!-- Agreement Signed -->
              <div *ngSwitchCase="ApplicationStatus.AGREEMENT_SIGNED" class="status-info info">
                <div class="status-message">
                  <span class="icon">📋</span>
                  <p>Agreement signed successfully. Waiting for project activation.</p>
                </div>
              </div>

              <!-- Active -->
              <div *ngSwitchCase="ApplicationStatus.ACTIVE" class="status-info success">
                <div class="status-message">
                  <span class="icon">🚀</span>
                  <p>Project is active! You can now start working on this project.</p>
                </div>
                <div class="action-buttons">
                  <button
                    class="btn btn-primary"
                    [routerLink]="['/projects', application.projectId]"
                  >
                    View Project
                  </button>
                  <button class="btn btn-outline" [routerLink]="['/work-sessions']">
                    Start Work Session
                  </button>
                </div>
              </div>

              <!-- Completed -->
              <div *ngSwitchCase="ApplicationStatus.COMPLETED" class="status-info success">
                <div class="status-message">
                  <span class="icon">🏆</span>
                  <p>Project completed successfully! Great work!</p>
                </div>
              </div>

              <!-- Rejected -->
              <div *ngSwitchCase="ApplicationStatus.REJECTED" class="status-info error">
                <div class="status-message">
                  <span class="icon">❌</span>
                  <p>Unfortunately, your application was not successful this time.</p>
                </div>
              </div>

              <!-- Cancelled -->
              <div *ngSwitchCase="ApplicationStatus.CANCELLED" class="status-info error">
                <div class="status-message">
                  <span class="icon">🚫</span>
                  <p>This application has been cancelled.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="application-meta">
              <span class="meta-item">
                <strong>User:</strong> {{ application.userName || 'N/A' }}
              </span>
              <span class="meta-item">
                <strong>Email:</strong> {{ application.userEmail || 'N/A' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noApplications>
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No Applications Yet</h3>
          <p>You haven't applied to any projects yet.</p>
          <button class="btn btn-primary" routerLink="/projects">Browse Projects</button>
        </div>
      </ng-template>

      <!-- Loading State -->
      <div class="loading" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading your applications...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .applications-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .applications-header {
        margin-bottom: 2rem;
      }

      .applications-header h1 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 2rem;
      }

      .header-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .stat-item {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: #007bff;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        color: #666;
        font-size: 0.9rem;
      }

      .applications-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 1.5rem;
      }

      .application-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid #e1e5e9;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .application-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 1.5rem;
        border-bottom: 1px solid #f0f0f0;
        gap: 1rem;
      }

      .project-info h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.2rem;
        line-height: 1.3;
      }

      .application-id {
        color: #666;
        font-size: 0.8rem;
      }

      .status-container {
        flex-shrink: 0;
      }

      .status-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-applied {
        background: #e3f2fd;
        color: #1976d2;
      }

      .status-assessment-in-progress {
        background: #fff3e0;
        color: #f57c00;
      }

      .status-assessment-completed {
        background: #f3e5f5;
        color: #7b1fa2;
      }

      .status-eligible {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .status-pending-verification {
        background: #fff3cd;
        color: #856404;
      }

      .status-agreement-signed {
        background: #e1f5fe;
        color: #0277bd;
      }

      .status-active {
        background: #e8f5e8;
        color: #1b5e20;
      }

      .status-completed {
        background: #f3e5f5;
        color: #4a148c;
      }

      .status-rejected {
        background: #ffebee;
        color: #c62828;
      }

      .status-cancelled {
        background: #fafafa;
        color: #424242;
      }

      .card-content {
        padding: 1.5rem;
      }

      .application-details {
        margin-bottom: 1.5rem;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        align-items: center;
      }

      .detail-row:last-child {
        margin-bottom: 0;
      }

      .detail-label {
        color: #666;
        font-size: 0.9rem;
      }

      .detail-value {
        color: #333;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .status-content {
        margin-bottom: 1rem;
      }

      .status-info {
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid;
      }

      .status-info.info {
        background: #e3f2fd;
        border-left-color: #2196f3;
      }

      .status-info.success {
        background: #e8f5e8;
        border-left-color: #4caf50;
      }

      .status-info.warning {
        background: #fff3e0;
        border-left-color: #ff9800;
      }

      .status-info.error {
        background: #ffebee;
        border-left-color: #f44336;
      }

      .status-message {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .status-message:last-child {
        margin-bottom: 0;
      }

      .status-message .icon {
        font-size: 1.2rem;
        flex-shrink: 0;
        margin-top: 0.1rem;
      }

      .status-message p {
        margin: 0;
        color: #555;
        line-height: 1.5;
      }

      .action-buttons {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: #0056b3;
      }

      .btn-success {
        background: #28a745;
        color: white;
      }

      .btn-success:hover:not(:disabled) {
        background: #1e7e34;
      }

      .btn-outline {
        background: transparent;
        border: 1px solid #007bff;
        color: #007bff;
      }

      .btn-outline:hover {
        background: #007bff;
        color: white;
      }

      .card-footer {
        background: #f8f9fa;
        padding: 1rem 1.5rem;
        border-top: 1px solid #f0f0f0;
      }

      .application-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .meta-item {
        font-size: 0.8rem;
        color: #666;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .empty-state p {
        color: #666;
        margin-bottom: 2rem;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading p {
        color: #666;
        margin: 0;
      }

      @media (max-width: 768px) {
        .applications-container {
          padding: 1rem;
        }

        .applications-header h1 {
          font-size: 1.5rem;
        }

        .applications-grid {
          grid-template-columns: 1fr;
        }

        .card-header {
          flex-direction: column;
          gap: 1rem;
        }

        .action-buttons {
          flex-direction: column;
        }

        .application-meta {
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
      }
    `,
  ],
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  signingAgreement = false;

  readonly ApplicationStatus = ApplicationStatus;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getUserApplications().subscribe({
      next: (applications) => {
        this.applications = applications.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
      },
    });
  }

  signAgreement(applicationId: number): void {
    this.signingAgreement = true;
    this.applicationService.signAgreement(applicationId).subscribe({
      next: (updatedApplication) => {
        this.signingAgreement = false;
        // Update the application in the list
        const index = this.applications.findIndex((app) => app.id === applicationId);
        if (index !== -1) {
          this.applications[index] = updatedApplication;
        }
        alert('Agreement signed successfully!');
      },
      error: (error) => {
        this.signingAgreement = false;
        console.error('Error signing agreement:', error);
        alert('Failed to sign agreement. Please try again.');
      },
    });
  }

  getStatusCount(status: string): number {
    return this.applications.filter((app) => app.status === status).length;
  }

  formatStatus(status: ApplicationStatus): string {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  trackByApplicationId(index: number, application: Application): number {
    return application.id;
  }
}
