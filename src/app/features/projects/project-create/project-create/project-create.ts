// src/app/features/projects/project-create/project-create.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Projectservice } from '../../../../core/services/projectservice';
import { ProjectCreateRequest } from '../../../../core/models/project-create-request';
import { ProjectType } from '../../../../core/models/project-type';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="project-create-container">
      <div class="create-header">
        <button class="back-btn" routerLink="/admin/projects">← Back to Projects</button>
        <h1>Create New Project</h1>
        <p class="header-subtitle">Fill in the details to create a new freelance project</p>
      </div>

      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="project-form">
        <!-- Basic Information -->
        <div class="form-section">
          <h2>Basic Information</h2>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="title">Project Title *</label>
              <input
                id="title"
                type="text"
                formControlName="title"
                placeholder="Enter a clear, descriptive project title"
                class="form-input"
                [class.error]="isFieldInvalid('title')"
              />
              <div *ngIf="isFieldInvalid('title')" class="error-message">
                Project title is required
              </div>
            </div>

            <div class="form-group">
              <label for="projectType">Project Type *</label>
              <select
                id="projectType"
                formControlName="projectType"
                class="form-input"
                [class.error]="isFieldInvalid('projectType')"
              >
                <option value="">Select project type</option>
                <option *ngFor="let type of projectTypes" [value]="type">
                  {{ formatProjectType(type) }}
                </option>
              </select>
              <div *ngIf="isFieldInvalid('projectType')" class="error-message">
                Please select a project type
              </div>
            </div>

            <div class="form-group">
              <label for="minScore">Minimum Score Required (%) *</label>
              <input
                id="minScore"
                type="number"
                formControlName="minScore"
                placeholder="70"
                min="0"
                max="100"
                class="form-input"
                [class.error]="isFieldInvalid('minScore')"
              />
              <div *ngIf="isFieldInvalid('minScore')" class="error-message">
                <span *ngIf="projectForm.get('minScore')?.errors?.['required']"
                  >Minimum score is required</span
                >
                <span *ngIf="projectForm.get('minScore')?.errors?.['min']"
                  >Score must be at least 0</span
                >
                <span *ngIf="projectForm.get('minScore')?.errors?.['max']"
                  >Score cannot exceed 100</span
                >
              </div>
            </div>

            <div class="form-group full-width">
              <label for="description">Project Description</label>
              <textarea
                id="description"
                formControlName="description"
                placeholder="Provide a detailed description of the project, requirements, and expectations..."
                class="form-input"
                rows="4"
              ></textarea>
              <small class="help-text">
                This will be visible to freelancers when browsing projects
              </small>
            </div>
          </div>
        </div>

        <!-- Payment & Timeline -->
        <div class="form-section">
          <h2>Payment & Timeline</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="payoutAmount">Payout Amount ($) *</label>
              <input
                id="payoutAmount"
                type="number"
                formControlName="payoutAmount"
                placeholder="500"
                min="1"
                step="0.01"
                class="form-input"
                [class.error]="isFieldInvalid('payoutAmount')"
              />
              <div *ngIf="isFieldInvalid('payoutAmount')" class="error-message">
                <span *ngIf="projectForm.get('payoutAmount')?.errors?.['required']"
                  >Payout amount is required</span
                >
                <span *ngIf="projectForm.get('payoutAmount')?.errors?.['min']"
                  >Amount must be greater than 0</span
                >
              </div>
            </div>

            <div class="form-group">
              <label for="billingCycleDays">Billing Cycle (Days) *</label>
              <select
                id="billingCycleDays"
                formControlName="billingCycleDays"
                class="form-input"
                [class.error]="isFieldInvalid('billingCycleDays')"
              >
                <option value="">Select billing cycle</option>
                <option value="7">Weekly (7 days)</option>
                <option value="14">Bi-weekly (14 days)</option>
                <option value="30">Monthly (30 days)</option>
                <option value="60">Bi-monthly (60 days)</option>
                <option value="90">Quarterly (90 days)</option>
              </select>
              <div *ngIf="isFieldInvalid('billingCycleDays')" class="error-message">
                Please select a billing cycle
              </div>
            </div>

            <div class="form-group">
              <label for="durationDays">Project Duration (Days)</label>
              <input
                id="durationDays"
                type="number"
                formControlName="durationDays"
                placeholder="30"
                min="1"
                max="365"
                class="form-input"
              />
              <small class="help-text"> Leave empty for ongoing projects </small>
            </div>
          </div>
        </div>

        <!-- CRM Integration -->
        <div class="form-section">
          <h2>CRM Integration</h2>
          <div class="form-group">
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="crmProvided" class="checkbox" />
                <span class="checkmark"></span>
                CRM access will be provided to freelancers
              </label>
            </div>
            <small class="help-text">
              Check this if freelancers will need access to your CRM system
            </small>
          </div>

          <div class="form-group" *ngIf="projectForm.get('crmProvided')?.value">
            <label for="crmUrl">CRM URL</label>
            <input
              id="crmUrl"
              type="url"
              formControlName="crmUrl"
              placeholder="https://your-crm-system.com"
              class="form-input"
            />
            <small class="help-text"> Provide the URL where freelancers can access the CRM </small>
          </div>
        </div>

        <!-- Statement of Work -->
        <div class="form-section">
          <h2>Statement of Work</h2>
          <div class="form-group">
            <label for="statementOfWork">Detailed Work Description</label>
            <div class="editor-container">
              <div class="editor-toolbar">
                <button
                  type="button"
                  class="editor-btn"
                  (click)="insertText('**', '**')"
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  class="editor-btn"
                  (click)="insertText('*', '*')"
                  title="Italic"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  class="editor-btn"
                  (click)="insertText('- ')"
                  title="Bullet Point"
                >
                  •
                </button>
                <button
                  type="button"
                  class="editor-btn"
                  (click)="insertText('1. ')"
                  title="Numbered List"
                >
                  1.
                </button>
              </div>
              <textarea
                #statementTextarea
                id="statementOfWork"
                formControlName="statementOfWork"
                placeholder="Provide detailed work instructions, deliverables, quality standards, and any specific requirements...

Example:
**Daily Tasks:**
- Respond to customer inquiries within 2 hours
- Update CRM records with interaction details
- Generate daily activity reports

**Quality Standards:**
- 95% customer satisfaction rating
- Professional communication tone
- Accurate data entry with zero errors

**Deliverables:**
- Weekly performance reports
- Monthly analytics summary"
                class="form-input statement-textarea"
                rows="12"
              ></textarea>
            </div>
            <small class="help-text">
              Use markdown formatting for better readability. This will be shown to freelancers as
              work instructions.
            </small>
          </div>

          <!-- Preview -->
          <div class="preview-section" *ngIf="projectForm.get('statementOfWork')?.value">
            <h3>Preview</h3>
            <div class="statement-preview" [innerHTML]="getFormattedStatement()"></div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-outline" routerLink="/admin/projects">Cancel</button>
          <button type="button" class="btn btn-secondary" (click)="saveDraft()">
            Save as Draft
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="projectForm.invalid || saving">
            <span *ngIf="saving" class="loading-spinner"></span>
            {{ saving ? 'Creating...' : 'Create Project' }}
          </button>
        </div>

        <!-- Error/Success Messages -->
        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .project-create-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
      }

      .create-header {
        margin-bottom: 2rem;
      }

      .back-btn {
        background: none;
        border: none;
        color: #007bff;
        cursor: pointer;
        font-size: 1rem;
        padding: 0;
        margin-bottom: 1rem;
        text-decoration: none;
      }

      .back-btn:hover {
        color: #0056b3;
      }

      .create-header h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 2rem;
      }

      .header-subtitle {
        margin: 0;
        color: #666;
        font-size: 1.1rem;
      }

      .form-section {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .form-section h2 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 1.3rem;
        border-bottom: 2px solid #e1e5e9;
        padding-bottom: 0.5rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-group label {
        font-weight: 500;
        color: #333;
        font-size: 0.9rem;
      }

      .form-input {
        padding: 0.75rem;
        border: 2px solid #e1e5e9;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        background: #f8f9fa;
      }

      .form-input:focus {
        outline: none;
        border-color: #007bff;
        background: white;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .form-input.error {
        border-color: #dc3545;
        background: #fff5f5;
      }

      .error-message {
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.25rem;
      }

      .help-text {
        color: #666;
        font-size: 0.8rem;
        margin-top: 0.25rem;
      }

      .checkbox-group {
        margin-bottom: 1rem;
      }

      .checkbox-label {
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .checkbox {
        display: none;
      }

      .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid #e1e5e9;
        border-radius: 4px;
        margin-right: 10px;
        margin-top: 2px;
        flex-shrink: 0;
        position: relative;
        transition: all 0.3s ease;
      }

      .checkmark::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .checkbox:checked + .checkmark {
        background: #007bff;
        border-color: #007bff;
      }

      .checkbox:checked + .checkmark::after {
        opacity: 1;
      }

      .editor-container {
        border: 2px solid #e1e5e9;
        border-radius: 6px;
        overflow: hidden;
        background: white;
      }

      .editor-toolbar {
        background: #f8f9fa;
        border-bottom: 1px solid #e1e5e9;
        padding: 0.5rem;
        display: flex;
        gap: 0.5rem;
      }

      .editor-btn {
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 4px;
        padding: 0.5rem;
        cursor: pointer;
        font-size: 0.8rem;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .editor-btn:hover {
        background: #e9ecef;
        border-color: #adb5bd;
      }

      .statement-textarea {
        border: none;
        border-radius: 0;
        background: white;
        min-height: 300px;
        resize: vertical;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      }

      .statement-textarea:focus {
        box-shadow: none;
      }

      .preview-section {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e1e5e9;
      }

      .preview-section h3 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.1rem;
      }

      .statement-preview {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e1e5e9;
        line-height: 1.6;
      }

      .statement-preview strong {
        color: #333;
        font-weight: 600;
      }

      .statement-preview em {
        color: #666;
        font-style: italic;
      }

      .statement-preview ul,
      .statement-preview ol {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
      }

      .statement-preview li {
        margin-bottom: 0.25rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        padding: 2rem 0;
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
        gap: 0.5rem;
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

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background: #5a6268;
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

      .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
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

      .alert {
        padding: 1rem;
        border-radius: 6px;
        margin-top: 1rem;
      }

      .alert-error {
        background: #fff5f5;
        color: #dc3545;
        border: 1px solid #f5c6cb;
      }

      .alert-success {
        background: #f0fff4;
        color: #28a745;
        border: 1px solid #c3e6cb;
      }

      @media (max-width: 768px) {
        .project-create-container {
          padding: 1rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column-reverse;
        }

        .editor-toolbar {
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class ProjectCreateComponent implements OnInit {
  projectForm!: FormGroup;
  projectTypes = Object.values(ProjectType);
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private projectService: Projectservice,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      statementOfWork: [''],
      projectType: ['', Validators.required],
      minScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      payoutAmount: ['', [Validators.required, Validators.min(1)]],
      billingCycleDays: ['', Validators.required],
      durationDays: ['', [Validators.min(1), Validators.max(365)]],
      crmProvided: [false],
      crmUrl: [''],
    });

    // Add conditional validator for CRM URL
    this.projectForm.get('crmProvided')?.valueChanges.subscribe((crmProvided) => {
      const crmUrlControl = this.projectForm.get('crmUrl');
      if (crmProvided) {
        crmUrlControl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      } else {
        crmUrlControl?.clearValidators();
      }
      crmUrlControl?.updateValueAndValidity();
    });
  }

  formatProjectType(type: ProjectType): string {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  insertText(before: string, after: string = ''): void {
    const textarea = document.getElementById('statementOfWork') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const replacement = before + selectedText + after;

      const newValue =
        textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

      // Update form control
      this.projectForm.patchValue({ statementOfWork: newValue });

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        );
      });
    }
  }

  getFormattedStatement(): string {
    const statement = this.projectForm.get('statementOfWork')?.value || '';
    return statement
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
      .replace(/\n/g, '<br>');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  saveDraft(): void {
    // In a real application, you would save as draft to backend
    this.successMessage = 'Project saved as draft!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.saving) {
      this.saving = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.projectForm.value;
      const createRequest: ProjectCreateRequest = {
        title: formValue.title,
        description: formValue.description,
        statementOfWork: formValue.statementOfWork,
        projectType: formValue.projectType,
        minScore: formValue.minScore,
        payoutAmount: parseFloat(formValue.payoutAmount),
        billingCycleDays: parseInt(formValue.billingCycleDays),
        durationDays: formValue.durationDays ? parseInt(formValue.durationDays) : undefined,
        crmProvided: formValue.crmProvided,
        crmUrl: formValue.crmProvided ? formValue.crmUrl : undefined,
      };

      this.projectService.createProject(createRequest).subscribe({
        next: (project) => {
          this.saving = false;
          this.successMessage = 'Project created successfully!';
          setTimeout(() => {
            this.router.navigate(['/admin/projects', project.id]);
          }, 2000);
        },
        error: (error) => {
          this.saving = false;
          this.errorMessage = error.error?.message || 'Failed to create project. Please try again.';
        },
      });
    }
  }
}
