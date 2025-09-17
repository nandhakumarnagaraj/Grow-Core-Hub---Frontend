import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Application } from '../../../../core/models/application';
import { ApplicationService } from '../../../../core/services/application-service';
import { ApplicationStatus } from '../../../../core/models/application-status';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="application-detail-container" *ngIf="application; else loading">
      <div class="detail-header">
        <button class="back-btn" (click)="goBack()">← Back to Applications</button>
        <div
          class="status-badge"
          [class]="'status-' + application.status.toLowerCase().replace('_', '-')"
        >
          {{ formatStatus(application.status) }}
        </div>
      </div>

      <div class="application-card">
        <div class="card-header">
          <h1>{{ application.projectTitle || 'Project #' + application.projectId }}</h1>
          <div class="application-meta">
            <span class="app-id">Application ID: #{{ application.id }}</span>
            <span class="applied-date">Applied: {{ application.createdAt | date : 'medium' }}</span>
          </div>
        </div>

        <div class="card-content">
          <div class="info-section">
            <h2>Application Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">User Name:</span>
                <span class="value">{{ application.userName || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">{{ application.userEmail || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Project ID:</span>
                <span class="value">#{{ application.projectId }}</span>
              </div>
              <div class="info-item" *ngIf="application.assessmentId">
                <span class="label">Assessment ID:</span>
                <span class="value">#{{ application.assessmentId }}</span>
              </div>
              <div class="info-item" *ngIf="application.signedAgreementAt">
                <span class="label">Agreement Signed:</span>
                <span class="value">{{ application.signedAgreementAt | date : 'medium' }}</span>
              </div>
            </div>
          </div>

          <!-- Status-specific content -->
          <div class="status-section">
            <h2>Current Status</h2>
            <div class="status-content" [ngSwitch]="application.status">
              <div *ngSwitchCase="ApplicationStatus.APPLIED" class="status-info info">
                <div class="status-message">
                  <span class="icon">⏳</span>
                  <div>
                    <h3>Application Under Review</h3>
                    <p>
                      Your application has been submitted and is currently being reviewed by our
                      team. You'll be notified once an assessment becomes available.
                    </p>
                  </div>
                </div>
              </div>

              <div
                *ngSwitchCase="ApplicationStatus.ASSESSMENT_IN_PROGRESS"
                class="status-info warning"
              >
                <div class="status-message">
                  <span class="icon">📝</span>
                  <div>
                    <h3>Assessment Available</h3>
                    <p>
                      Your assessment is ready. Please complete it to proceed with your application.
                    </p>
                  </div>
                </div>
                <div class="action-buttons" *ngIf="application.assessmentId">
                  <button
                    class="btn btn-primary"
                    [routerLink]="['/assessments', application.assessmentId]"
                  >
                    Take Assessment
                  </button>
                </div>
              </div>

              <div *ngSwitchCase="ApplicationStatus.ASSESSMENT_COMPLETED" class="status-info info">
                <div class="status-message">
                  <span class="icon">✅</span>
                  <div>
                    <h3>Assessment Completed</h3>
                    <p>
                      You have successfully completed the assessment. We're currently reviewing your
                      results.
                    </p>
                  </div>
                </div>
              </div>

              <div *ngSwitchCase="ApplicationStatus.ELIGIBLE" class="status-info success">
                <div class="status-message">
                  <span class="icon">🎉</span>
                  <div>
                    <h3>Congratulations! You're Eligible</h3>
                    <p>
                      You've successfully passed the assessment and are eligible for this project.
                      Please sign the agreement to proceed.
                    </p>
                  </div>
                </div>
                <div class="action-buttons">
                  <button
                    class="btn btn-success"
                    (click)="signAgreement()"
                    [disabled]="signingAgreement"
                  >
                    {{ signingAgreement ? 'Signing...' : 'Sign Agreement' }}
                  </button>
                </div>
              </div>

              <div
                *ngSwitchCase="ApplicationStatus.PENDING_VERIFICATION"
                class="status-info warning"
              >
                <div class="status-message">
                  <span class="icon">🔍</span>
                  <div>
                    <h3>Under Final Verification</h3>
                    <p>
                      Your agreement has been signed and your application is under final
                      verification. This process typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div *ngSwitchCase="ApplicationStatus.AGREEMENT_SIGNED" class="status-info info">
                <div class="status-message">
                  <span class="icon">📋</span>
                  <div>
                    <h3>Agreement Signed Successfully</h3>
                    <p>Your agreement has been signed. Waiting for project activation.</p>
                  </div>
                </div>
              </div>

              <div *ngSwitchCase="ApplicationStatus.ACTIVE" class="status-info success">
                <div class="status-message">
                  <span class="icon">🚀</span>
                  <div>
                    <h3>Project Active!</h3>
                    <p>
                      Congratulations! Your project is now active and you can start working
                      immediately.
                    </p>
                  </div>
                </div>
                <div class="action-buttons">
                  <button
                    class="btn btn-primary"
                    [routerLink]="['/projects', application.projectId]"
                  >
                    View Project Details
                  </button>
                  <button class="btn btn-outline" [routerLink]="['/work-sessions']">
                    Start Work Session
                  </button>
                </div>
              </div>

              <div *ngSwitchCase="ApplicationStatus.COMPLETED" class="status-info success">
                <div class="status-message">
                  <span class="icon">🏆</span>
                  <div>
                    <h3>Project Completed!</h3>
                    <p>
                      Excellent work! You have successfully completed this project. Payment will be
                      processed according to the agreed terms.
                    </p>
                  </div>
                </div>
              </div>

              <div *ngSwitchCase="ApplicationStatus.REJECTED" class="status-info error">
                <div class="status-message">
                  <span class="icon">❌</span>
                  <div>
                    <h3>Application Not Successful</h3>
                    <p>
                      Unfortunately, your application was not successful this time. Please don't be
                      discouraged - there are many other opportunities available.
                    </p>
                  </div>
                </div>
                <div class="action-buttons">
                  <button class="btn btn-outline" [routerLink]="['/projects']">
                    Browse Other Projects
                  </button>
                </div>
              </div>

              <div *ngSwitchCase="ApplicationStatus.CANCELLED" class="status-info error">
                <div class="status-message">
                  <span class="icon">🚫</span>
                  <div>
                    <h3>Application Cancelled</h3>
                    <p>This application has been cancelled and is no longer active.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="timeline-section">
            <h2>Application Timeline</h2>
            <div class="timeline">
              <div class="timeline-item completed">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Application Submitted</h4>
                  <p>{{ application.createdAt | date : 'medium' }}</p>
                </div>
              </div>

              <div
                class="timeline-item"
                [class.completed]="isStatusReached('ASSESSMENT_IN_PROGRESS')"
                [class.active]="application.status === 'ASSESSMENT_IN_PROGRESS'"
              >
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Assessment Available</h4>
                  <p>Ready for assessment</p>
                </div>
              </div>

              <div
                class="timeline-item"
                [class.completed]="isStatusReached('ASSESSMENT_COMPLETED')"
                [class.active]="application.status === 'ASSESSMENT_COMPLETED'"
              >
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Assessment Completed</h4>
                  <p>Results under review</p>
                </div>
              </div>

              <div
                class="timeline-item"
                [class.completed]="isStatusReached('ELIGIBLE')"
                [class.active]="application.status === 'ELIGIBLE'"
              >
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Eligible for Project</h4>
                  <p>Ready to sign agreement</p>
                </div>
              </div>

              <div
                class="timeline-item"
                [class.completed]="isStatusReached('ACTIVE')"
                [class.active]="application.status === 'ACTIVE'"
              >
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Project Active</h4>
                  <p>Work can begin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>Loading application details...</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .application-detail-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .back-btn {
        background: none;
        border: none;
        color: #007bff;
        cursor: pointer;
        font-size: 1rem;
        padding: 0.5rem 0;
      }

      .back-btn:hover {
        color: #0056b3;
      }

      .status-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
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

      .application-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .card-header {
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .card-header h1 {
        margin: 0 0 1rem 0;
        font-size: 1.8rem;
      }

      .application-meta {
        display: flex;
        gap: 2rem;
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .card-content {
        padding: 2rem;
      }

      .info-section,
      .status-section,
      .timeline-section {
        margin-bottom: 3rem;
      }

      .info-section h2,
      .status-section h2,
      .timeline-section h2 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 1.3rem;
        border-bottom: 2px solid #e1e5e9;
        padding-bottom: 0.5rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .label {
        color: #666;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .value {
        color: #333;
        font-weight: 600;
      }

      .status-info {
        padding: 1.5rem;
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
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .status-message .icon {
        font-size: 1.5rem;
        flex-shrink: 0;
        margin-top: 0.1rem;
      }

      .status-message h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.1rem;
      }

      .status-message p {
        margin: 0;
        color: #666;
        line-height: 1.5;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
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

      .timeline {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .timeline-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        opacity: 0.5;
        transition: opacity 0.3s ease;
      }

      .timeline-item.completed {
        opacity: 1;
      }

      .timeline-item.active {
        opacity: 1;
      }

      .timeline-marker {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #e1e5e9;
        border: 3px solid #f8f9fa;
        flex-shrink: 0;
        margin-top: 0.25rem;
      }

      .timeline-item.completed .timeline-marker {
        background: #28a745;
      }

      .timeline-item.active .timeline-marker {
        background: #007bff;
        box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2);
      }

      .timeline-content h4 {
        margin: 0 0 0.25rem 0;
        color: #333;
        font-size: 1rem;
      }

      .timeline-content p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        color: #666;
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

      @media (max-width: 768px) {
        .application-detail-container {
          padding: 1rem;
        }

        .detail-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .application-meta {
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ApplicationDetailComponent implements OnInit {
  application: Application | null = null;
  signingAgreement = false;

  readonly ApplicationStatus = ApplicationStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadApplication(+id);
    }
  }

  loadApplication(id: number): void {
    this.applicationService.getApplication(id).subscribe({
      next: (application) => {
        this.application = application;
      },
      error: (error) => {
        console.error('Error loading application:', error);
        this.router.navigate(['/applications']);
      },
    });
  }

  signAgreement(): void {
    if (!this.application) return;

    this.signingAgreement = true;
    this.applicationService.signAgreement(this.application.id).subscribe({
      next: (updatedApplication) => {
        this.application = updatedApplication;
        this.signingAgreement = false;
        alert('Agreement signed successfully!');
      },
      error: (error) => {
        this.signingAgreement = false;
        console.error('Error signing agreement:', error);
        alert('Failed to sign agreement. Please try again.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  formatStatus(status: ApplicationStatus): string {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  isStatusReached(targetStatus: string): boolean {
    if (!this.application) return false;

    const statusOrder = [
      'APPLIED',
      'ASSESSMENT_IN_PROGRESS',
      'ASSESSMENT_COMPLETED',
      'ELIGIBLE',
      'PENDING_VERIFICATION',
      'AGREEMENT_SIGNED',
      'ACTIVE',
      'COMPLETED',
    ];

    const currentIndex = statusOrder.indexOf(this.application.status);
    const targetIndex = statusOrder.indexOf(targetStatus);

    return currentIndex >= targetIndex;
  }
}
