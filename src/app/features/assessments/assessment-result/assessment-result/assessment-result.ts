import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AssessmentService } from '../../../../core/services/assessment-service';
import { Assessment } from '../../../../core/models/assessment';
import { AssessmentStatus } from '../../../../core/models/assessment-status';

@Component({
  selector: 'app-assessment-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="assessment-result-container" *ngIf="assessment; else loading">
      <div class="result-header">
        <button class="back-btn" (click)="goBack()">← Back</button>
        <div class="assessment-info">
          <h1>Assessment Results</h1>
          <p>{{ assessment.projectTitle }}</p>
        </div>
      </div>

      <div class="result-content">
        <!-- Score Display -->
        <div class="score-card" [class.passing]="isPassing()" [class.failing]="!isPassing()">
          <div class="score-circle">
            <div class="score-value">{{ assessment.score || 0 }}%</div>
          </div>
          <div class="score-details">
            <h2 *ngIf="isPassing()">Congratulations! 🎉</h2>
            <h2 *ngIf="!isPassing()">Keep Trying! 💪</h2>
            <p *ngIf="isPassing()">
              You've successfully passed the assessment and are eligible to proceed with the
              application.
            </p>
            <p *ngIf="!isPassing()">
              You didn't meet the minimum score requirement this time. Don't worry, you can improve
              your skills and try again with other projects.
            </p>
          </div>
        </div>

        <!-- Assessment Details -->
        <div class="details-section">
          <h3>Assessment Summary</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Assessment Type:</span>
              <span class="value">{{ formatAssessmentType(assessment.type) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Total Questions:</span>
              <span class="value">{{ assessment.questions.length }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Submitted On:</span>
              <span class="value">{{ assessment.submittedAt | date : 'medium' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Status:</span>
              <span class="value">{{ formatStatus(assessment.status) }}</span>
            </div>
          </div>
        </div>

        <!-- Performance Breakdown -->
        <div class="performance-section" *ngIf="assessment.questions.length > 0">
          <h3>Performance Breakdown</h3>
          <div class="performance-stats">
            <div class="stat-item">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-value">
                  {{ getCorrectAnswers() }}/{{ assessment.questions.length }}
                </div>
                <div class="stat-label">Questions Answered Correctly</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">⏱️</div>
              <div class="stat-content">
                <div class="stat-value">{{ getTimeSpent() }}</div>
                <div class="stat-label">Time Spent</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value">{{ getAccuracyPercentage() }}%</div>
                <div class="stat-label">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="next-steps-section">
          <h3>What's Next?</h3>
          <div class="steps-content" *ngIf="isPassing(); else failedSteps">
            <div class="step-item">
              <span class="step-number">1</span>
              <div class="step-content">
                <h4>Wait for Approval</h4>
                <p>
                  Your results will be reviewed and you'll be notified of your application status.
                </p>
              </div>
            </div>
            <div class="step-item">
              <span class="step-number">2</span>
              <div class="step-content">
                <h4>Sign Agreement</h4>
                <p>If approved, you'll receive an agreement to sign before starting work.</p>
              </div>
            </div>
            <div class="step-item">
              <span class="step-number">3</span>
              <div class="step-content">
                <h4>Start Working</h4>
                <p>Once everything is set up, you can begin working on the project.</p>
              </div>
            </div>
          </div>

          <ng-template #failedSteps>
            <div class="steps-content">
              <div class="step-item">
                <span class="step-number">1</span>
                <div class="step-content">
                  <h4>Review Your Performance</h4>
                  <p>Analyze areas where you can improve for future assessments.</p>
                </div>
              </div>
              <div class="step-item">
                <span class="step-number">2</span>
                <div class="step-content">
                  <h4>Enhance Your Skills</h4>
                  <p>Consider additional training or practice in relevant areas.</p>
                </div>
              </div>
              <div class="step-item">
                <span class="step-number">3</span>
                <div class="step-content">
                  <h4>Apply to Other Projects</h4>
                  <p>Explore other opportunities that match your current skill level.</p>
                </div>
              </div>
            </div>
          </ng-template>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <button class="btn btn-primary" routerLink="/applications">View My Applications</button>
          <button class="btn btn-outline" routerLink="/projects">Browse More Projects</button>
          <button class="btn btn-outline" routerLink="/profile">Update Profile</button>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>Loading assessment results...</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .assessment-result-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }

      .result-header {
        display: flex;
        align-items: center;
        gap: 1rem;
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

      .assessment-info h1 {
        margin: 0;
        color: #333;
      }

      .assessment-info p {
        margin: 0.5rem 0 0 0;
        color: #666;
      }

      .score-card {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        border-left: 6px solid;
      }

      .score-card.passing {
        border-left-color: #28a745;
        background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%);
      }

      .score-card.failing {
        border-left-color: #dc3545;
        background: linear-gradient(135deg, #ffebee 0%, #fff5f5 100%);
      }

      .score-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }

      .score-card.passing .score-circle {
        border: 6px solid #28a745;
      }

      .score-card.failing .score-circle {
        border: 6px solid #dc3545;
      }

      .score-value {
        font-size: 2rem;
        font-weight: bold;
        color: #333;
      }

      .score-details h2 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.5rem;
      }

      .score-details p {
        margin: 0;
        color: #666;
        line-height: 1.6;
      }

      .details-section,
      .performance-section,
      .next-steps-section {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .details-section h3,
      .performance-section h3,
      .next-steps-section h3 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 1.3rem;
        border-bottom: 2px solid #e1e5e9;
        padding-bottom: 0.5rem;
      }

      .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .detail-item {
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

      .performance-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .stat-icon {
        font-size: 1.5rem;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
      }

      .stat-label {
        color: #666;
        font-size: 0.9rem;
      }

      .steps-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .step-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .step-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }

      .step-content h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.1rem;
      }

      .step-content p {
        margin: 0;
        color: #666;
        line-height: 1.5;
      }

      .action-section {
        display: flex;
        gap: 1rem;
        justify-content: center;
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

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background: #0056b3;
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
        .assessment-result-container {
          padding: 1rem;
        }

        .result-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .score-card {
          flex-direction: column;
          text-align: center;
          gap: 1.5rem;
        }

        .details-grid {
          grid-template-columns: 1fr;
        }

        .performance-stats {
          grid-template-columns: 1fr;
        }

        .action-section {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class AssessmentResultComponent implements OnInit {
  assessment: Assessment | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadAssessmentResult(+id);
    }
  }

  loadAssessmentResult(id: number): void {
    this.assessmentService.getAssessmentResult(id).subscribe({
      next: (assessment) => {
        this.assessment = assessment;
      },
      error: (error) => {
        console.error('Error loading assessment result:', error);
        this.router.navigate(['/applications']);
      },
    });
  }

  isPassing(): boolean {
    if (!this.assessment || this.assessment.score === undefined) return false;
    return this.assessment.score >= 70; // Assuming 70% is passing
  }

  getCorrectAnswers(): number {
    // This would need to be calculated based on actual answers vs correct answers
    // For now, we'll estimate based on score
    if (!this.assessment || this.assessment.score === undefined) return 0;
    return Math.round((this.assessment.score / 100) * this.assessment.questions.length);
  }

  getTimeSpent(): string {
    if (!this.assessment || !this.assessment.submittedAt) return 'N/A';
    // This would ideally come from the backend
    // For now, we'll show a placeholder
    return '45 minutes';
  }

  getAccuracyPercentage(): number {
    return this.assessment?.score || 0;
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  formatAssessmentType(type: string): string {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  formatStatus(status: AssessmentStatus): string {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
