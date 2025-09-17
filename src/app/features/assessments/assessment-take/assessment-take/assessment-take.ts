// src/app/features/assessments/assessment-take/assessment-take.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AssessmentService } from '../../../../core/services/assessment-service';
import { Assessment } from '../../../../core/models/assessment';
import { AssessmentStatus } from '../../../../core/models/assessment-status';
import { AssessmentType } from '../../../../core/models/assessment-type';
import { AssessmentSubmissionRequest } from '../../../../core/models/assessment-submission-request';
import { Answer } from '../../../../core/models/answer';

@Component({
  selector: 'app-assessment-take',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="assessment-container" *ngIf="assessment; else loading">
      <div class="assessment-header">
        <button class="back-btn" (click)="goBack()">← Back</button>
        <div class="assessment-info">
          <h1>{{ assessment.projectTitle }} Assessment</h1>
          <div class="assessment-meta">
            <span class="assessment-type">{{ formatAssessmentType(assessment.type) }}</span>
            <span class="question-count">{{ assessment.questions.length }} Questions</span>
            <span
              class="status-badge"
              [class]="'status-' + assessment.status.toLowerCase().replace('_', '-')"
            >
              {{ formatStatus(assessment.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Assessment Instructions -->
      <div
        class="instructions-card"
        *ngIf="!assessmentStarted && assessment.status === AssessmentStatus.NOT_STARTED"
      >
        <h2>Assessment Instructions</h2>
        <div class="instructions-content">
          <ul>
            <li>This assessment contains {{ assessment.questions.length }} questions</li>
            <li>You must answer all questions to submit the assessment</li>
            <li>Once started, you cannot pause the assessment</li>
            <li>Make sure you have a stable internet connection</li>
            <li>Read each question carefully before answering</li>
            <li *ngIf="assessment.type === AssessmentType.PRACTICAL_UPLOAD">
              For file upload questions, ensure your files are in the correct format
            </li>
          </ul>
          <div class="instruction-actions">
            <button class="btn btn-primary" (click)="startAssessment()">Start Assessment</button>
          </div>
        </div>
      </div>

      <!-- Assessment Form -->
      <div
        class="assessment-form"
        *ngIf="assessmentStarted || assessment.status === AssessmentStatus.IN_PROGRESS"
      >
        <form [formGroup]="assessmentForm" (ngSubmit)="submitAssessment()">
          <!-- Progress Bar -->
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="getProgress()"></div>
            </div>
            <span class="progress-text"
              >{{ getAnsweredCount() }} / {{ assessment.questions.length }} answered</span
            >
          </div>

          <!-- Questions -->
          <div class="questions-container">
            <div class="question-card" *ngFor="let question of assessment.questions; let i = index">
              <div class="question-header">
                <span class="question-number">Question {{ i + 1 }}</span>
                <span class="question-points">{{ question.points }} points</span>
              </div>

              <div class="question-content">
                <p class="question-text">{{ question.question }}</p>

                <!-- Multiple Choice Questions -->
                <div class="answer-options" *ngIf="question.options && question.options.length > 0">
                  <label
                    class="option-label"
                    *ngFor="let option of question.options; let optionIndex = index"
                  >
                    <input
                      type="radio"
                      [name]="'question_' + question.id"
                      [value]="option"
                      (change)="updateAnswer(question.id, option)"
                    />
                    <span class="option-text">{{ option }}</span>
                  </label>
                </div>

                <!-- Text/Typing Questions -->
                <div class="text-answer" *ngIf="!question.options || question.options.length === 0">
                  <textarea
                    [placeholder]="getTextPlaceholder(assessment.type)"
                    (input)="updateAnswer(question.id, $event)"
                    class="answer-textarea"
                    rows="6"
                  >
                  </textarea>
                </div>

                <!-- File Upload (if practical assessment) -->
                <div
                  class="file-upload"
                  *ngIf="assessment.type === AssessmentType.PRACTICAL_UPLOAD"
                >
                  <input
                    type="file"
                    [id]="'file_' + question.id"
                    (change)="handleFileUpload(question.id, $event)"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                    class="file-input"
                  />
                  <label [for]="'file_' + question.id" class="file-label">
                    <span class="file-icon">📁</span>
                    Choose File
                  </label>
                  <span class="file-info">PDF, DOC, JPG, PNG, ZIP (Max 10MB)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Section -->
          <div class="submit-section">
            <div class="submit-warning" *ngIf="getAnsweredCount() < assessment.questions.length">
              <span class="warning-icon">⚠️</span>
              Please answer all questions before submitting.
            </div>
            <button
              type="submit"
              class="btn btn-success btn-lg"
              [disabled]="isSubmitting || getAnsweredCount() < assessment.questions.length"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Assessment' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Assessment Completed -->
      <div
        class="assessment-completed"
        *ngIf="
          assessment.status === AssessmentStatus.SUBMITTED ||
          assessment.status === AssessmentStatus.GRADED
        "
      >
        <div class="completion-card">
          <div class="completion-icon">🎉</div>
          <h2>Assessment Submitted!</h2>
          <p *ngIf="assessment.status === AssessmentStatus.SUBMITTED">
            Your assessment has been submitted successfully. You'll be notified once it's been
            graded.
          </p>
          <div class="assessment-results" *ngIf="assessment.status === AssessmentStatus.GRADED">
            <div class="score-display">
              <span class="score-label">Your Score:</span>
              <span class="score-value" [class.passing]="(assessment.score || 0) >= 70">
                {{ assessment.score }}%
              </span>
            </div>
            <p class="score-message" *ngIf="(assessment.score || 0) >= 70">
              Congratulations! You passed the assessment.
            </p>
            <p class="score-message error" *ngIf="(assessment.score || 0) < 70">
              Unfortunately, you didn't meet the minimum requirements this time.
            </p>
          </div>
          <div class="completion-actions">
            <button class="btn btn-primary" routerLink="/applications">View Applications</button>
            <button class="btn btn-outline" routerLink="/projects">Browse Projects</button>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>Loading assessment...</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .assessment-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }

      .assessment-header {
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

      .assessment-info {
        flex: 1;
      }

      .assessment-info h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .assessment-meta {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .assessment-type,
      .question-count {
        background: #f8f9fa;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        color: #666;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .status-not-started {
        background: #e3f2fd;
        color: #1976d2;
      }

      .status-in-progress {
        background: #fff3e0;
        color: #f57c00;
      }

      .status-submitted {
        background: #f3e5f5;
        color: #7b1fa2;
      }

      .status-graded {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .instructions-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid #e1e5e9;
      }

      .instructions-card h2 {
        margin: 0 0 1.5rem 0;
        color: #333;
      }

      .instructions-content ul {
        margin: 0 0 2rem 0;
        padding-left: 1.5rem;
      }

      .instructions-content li {
        margin-bottom: 0.5rem;
        color: #666;
        line-height: 1.5;
      }

      .assessment-form {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid #e1e5e9;
        overflow: hidden;
      }

      .progress-container {
        padding: 1.5rem;
        border-bottom: 1px solid #f0f0f0;
        background: #f8f9fa;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }

      .progress-fill {
        height: 100%;
        background: #28a745;
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .progress-text {
        font-size: 0.9rem;
        color: #666;
        font-weight: 500;
      }

      .questions-container {
        padding: 2rem;
      }

      .question-card {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #f0f0f0;
      }

      .question-card:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .question-number {
        font-weight: 600;
        color: #007bff;
      }

      .question-points {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .question-text {
        color: #333;
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .answer-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .option-label {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      .option-label:hover {
        background: #e9ecef;
      }

      .option-label input[type='radio'] {
        margin-top: 0.25rem;
      }

      .option-label input[type='radio']:checked + .option-text {
        font-weight: 600;
      }

      .option-label:has(input:checked) {
        background: #e3f2fd;
        border-color: #2196f3;
      }

      .option-text {
        flex: 1;
        color: #333;
        line-height: 1.5;
      }

      .text-answer {
        margin-top: 1rem;
      }

      .answer-textarea {
        width: 100%;
        padding: 1rem;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 1rem;
        font-family: inherit;
        resize: vertical;
        min-height: 120px;
        transition: border-color 0.3s ease;
      }

      .answer-textarea:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .file-upload {
        margin-top: 1rem;
        text-align: center;
      }

      .file-input {
        display: none;
      }

      .file-label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        background: #007bff;
        color: white;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s ease;
      }

      .file-label:hover {
        background: #0056b3;
      }

      .file-icon {
        font-size: 1.2rem;
      }

      .file-info {
        display: block;
        margin-top: 0.5rem;
        color: #666;
        font-size: 0.8rem;
      }

      .submit-section {
        padding: 2rem;
        background: #f8f9fa;
        border-top: 1px solid #f0f0f0;
        text-align: center;
      }

      .submit-warning {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        color: #856404;
        font-weight: 500;
      }

      .warning-icon {
        font-size: 1.2rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
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

      .btn-lg {
        padding: 1rem 2rem;
        font-size: 1.1rem;
      }

      .assessment-completed {
        background: white;
        border-radius: 12px;
        padding: 3rem 2rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .completion-card {
        max-width: 500px;
        margin: 0 auto;
      }

      .completion-icon {
        font-size: 4rem;
        margin-bottom: 1.5rem;
      }

      .completion-card h2 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .completion-card p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 2rem;
      }

      .assessment-results {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
      }

      .score-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .score-label {
        font-size: 1.1rem;
        color: #666;
      }

      .score-value {
        font-size: 2rem;
        font-weight: bold;
        color: #dc3545;
      }

      .score-value.passing {
        color: #28a745;
      }

      .score-message {
        margin: 0;
        font-weight: 500;
        color: #28a745;
      }

      .score-message.error {
        color: #dc3545;
      }

      .completion-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .instruction-actions {
        text-align: center;
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

      .loading p {
        margin: 0;
      }

      @media (max-width: 768px) {
        .assessment-container {
          padding: 1rem;
        }

        .assessment-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .assessment-meta {
          flex-direction: column;
          align-items: flex-start;
        }

        .questions-container {
          padding: 1rem;
        }

        .submit-section {
          padding: 1rem;
        }

        .completion-actions {
          flex-direction: column;
        }

        .question-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .option-label {
          padding: 0.75rem;
        }
      }
    `,
  ],
})
export class AssessmentTakeComponent implements OnInit {
  assessment: Assessment | null = null;
  assessmentForm: FormGroup;
  assessmentStarted = false;
  isSubmitting = false;
  answers: Map<string, Answer> = new Map();

  readonly AssessmentStatus = AssessmentStatus;
  readonly AssessmentType = AssessmentType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService,
    private fb: FormBuilder
  ) {
    this.assessmentForm = this.fb.group({});
  }

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.params['id'];
    if (assessmentId) {
      this.loadAssessment(+assessmentId);
    }
  }

  loadAssessment(id: number): void {
    this.assessmentService.getAssessment(id).subscribe({
      next: (assessment) => {
        this.assessment = assessment;
        if (assessment.status === AssessmentStatus.IN_PROGRESS) {
          this.assessmentStarted = true;
        }
      },
      error: (error) => {
        console.error('Error loading assessment:', error);
        alert('Failed to load assessment');
        this.goBack();
      },
    });
  }

  startAssessment(): void {
    if (!this.assessment) return;

    this.assessmentService.startAssessment(this.assessment.id).subscribe({
      next: (assessment) => {
        this.assessment = assessment;
        this.assessmentStarted = true;
      },
      error: (error) => {
        console.error('Error starting assessment:', error);
        alert('Failed to start assessment');
      },
    });
  }

  updateAnswer(questionId: string, answerValue: any): void {
    let answerText = '';

    if (typeof answerValue === 'string') {
      answerText = answerValue;
    } else if (answerValue?.target) {
      answerText = answerValue.target.value;
    }

    const answer: Answer = {
      questionId,
      answer: answerText,
      textContent: answerText,
    };

    this.answers.set(questionId, answer);
  }

  handleFileUpload(questionId: string, event: any): void {
    const file = event.target.files[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // and store the URL or file reference
      const answer: Answer = {
        questionId,
        answer: file.name,
        textContent: `File uploaded: ${file.name}`,
      };
      this.answers.set(questionId, answer);
    }
  }

  getProgress(): number {
    if (!this.assessment) return 0;
    return (this.getAnsweredCount() / this.assessment.questions.length) * 100;
  }

  getAnsweredCount(): number {
    return this.answers.size;
  }

  getTextPlaceholder(assessmentType: AssessmentType): string {
    switch (assessmentType) {
      case AssessmentType.TYPING:
        return 'Type your answer here...';
      case AssessmentType.PRACTICAL_UPLOAD:
        return 'Describe your solution or provide additional context...';
      default:
        return 'Enter your answer...';
    }
  }

  submitAssessment(): void {
    if (!this.assessment || this.isSubmitting) return;

    if (this.answers.size < this.assessment.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    this.isSubmitting = true;

    const submissionRequest: AssessmentSubmissionRequest = {
      answers: Array.from(this.answers.values()),
    };

    this.assessmentService.submitAssessment(this.assessment.id, submissionRequest).subscribe({
      next: (assessment) => {
        this.assessment = assessment;
        this.isSubmitting = false;
        // Assessment status should now be SUBMITTED
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error submitting assessment:', error);
        alert('Failed to submit assessment. Please try again.');
      },
    });
  }

  formatAssessmentType(type: AssessmentType): string {
    switch (type) {
      case AssessmentType.MCQ:
        return 'Multiple Choice';
      case AssessmentType.TYPING:
        return 'Typing Test';
      case AssessmentType.PRACTICAL_UPLOAD:
        return 'Practical Assessment';
      case AssessmentType.MIXED:
        return 'Mixed Assessment';
      default:
        return type;
    }
  }

  formatStatus(status: AssessmentStatus): string {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }
}
