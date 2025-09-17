import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Project } from '../../../../core/models/project';
import { Projectservice } from '../../../../core/services/projectservice';
import { ProjectType } from '../../../../core/models/project-type';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="project-detail-container" *ngIf="project; else loading">
      <div class="project-header">
        <button class="back-btn" (click)="goBack()">← Back to Projects</button>
        <div class="project-status" [class]="'status-' + project.status.toLowerCase()">
          {{ project.status }}
        </div>
      </div>

      <div class="project-content">
        <div class="project-main">
          <h1>{{ project.title }}</h1>
          <div class="project-type-badge">
            {{ formatProjectType(project.projectType) }}
          </div>

          <div class="project-section">
            <h2>Description</h2>
            <p>{{ project.description || 'No description provided' }}</p>
          </div>

          <div class="project-section" *ngIf="project.statementOfWork">
            <h2>Statement of Work</h2>
            <div class="statement-of-work" [innerHTML]="project.statementOfWork"></div>
          </div>

          <div class="project-section">
            <h2>Requirements</h2>
            <div class="requirements-grid">
              <div class="requirement-item">
                <span class="requirement-label">Minimum Score Required</span>
                <span class="requirement-value">{{ project.minScore }}%</span>
              </div>
              <div class="requirement-item" *ngIf="project.durationDays">
                <span class="requirement-label">Project Duration</span>
                <span class="requirement-value">{{ project.durationDays }} days</span>
              </div>
            </div>
          </div>
        </div>

        <div class="project-sidebar">
          <div class="apply-card">
            <h3>Apply for this Project</h3>
            <div class="compensation-info">
              <div class="compensation-item">
                <span class="label">Payout Amount</span>
                <span class="amount">\${{ project.payoutAmount }}</span>
              </div>
              <div class="compensation-item">
                <span class="label">Billing Cycle</span>
                <span class="cycle">Every {{ project.billingCycleDays }} days</span>
              </div>
            </div>

            <div class="crm-info" *ngIf="project.crmProvided">
              <div class="info-item">
                <span class="icon">✓</span>
                <span>CRM Access Provided</span>
              </div>
            </div>

            <button class="apply-btn" (click)="applyToProject()" [disabled]="isApplying">
              {{ isApplying ? 'Applying...' : 'Apply Now' }}
            </button>

            <div class="apply-info">
              <p>By applying, you'll be required to:</p>
              <ul>
                <li>Complete a skills assessment</li>
                <li>Achieve minimum {{ project.minScore }}% score</li>
                <li>Sign project agreement if selected</li>
              </ul>
            </div>
          </div>

          <div class="project-meta">
            <h3>Project Information</h3>
            <div class="meta-item">
              <span class="meta-label">Posted on</span>
              <span class="meta-value">{{ project.createdAt | date : 'mediumDate' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Project Type</span>
              <span class="meta-value">{{ formatProjectType(project.projectType) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Status</span>
              <span class="meta-value">{{ project.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .project-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .project-header {
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
        transition: color 0.3s ease;
      }

      .back-btn:hover {
        color: #0056b3;
      }

      .project-status {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-active {
        background: #d4edda;
        color: #155724;
      }

      .status-paused {
        background: #fff3cd;
        color: #856404;
      }

      .status-closed {
        background: #f8d7da;
        color: #721c24;
      }

      .project-content {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 3rem;
      }

      .project-main h1 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 2rem;
        line-height: 1.2;
      }

      .project-type-badge {
        display: inline-block;
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 2rem;
      }

      .project-section {
        margin-bottom: 2.5rem;
      }

      .project-section h2 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.3rem;
        border-bottom: 2px solid #e1e5e9;
        padding-bottom: 0.5rem;
      }

      .project-section p {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }

      .statement-of-work {
        color: #666;
        line-height: 1.6;
      }

      .requirements-grid {
        display: grid;
        gap: 1rem;
      }

      .requirement-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #007bff;
      }

      .requirement-label {
        color: #666;
        font-size: 0.9rem;
      }

      .requirement-value {
        color: #333;
        font-weight: 600;
      }

      .apply-card {
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        position: sticky;
        top: 2rem;
      }

      .apply-card h3 {
        margin: 0 0 1.5rem 0;
        color: #333;
      }

      .compensation-info {
        margin-bottom: 1.5rem;
      }

      .compensation-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .compensation-item:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #666;
        font-size: 0.9rem;
      }

      .amount {
        color: #28a745;
        font-weight: 700;
        font-size: 1.2rem;
      }

      .cycle {
        color: #333;
        font-weight: 500;
      }

      .crm-info {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #e8f5e8;
        border-radius: 8px;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #155724;
        font-size: 0.9rem;
      }

      .icon {
        color: #28a745;
        font-weight: bold;
      }

      .apply-btn {
        width: 100%;
        padding: 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
        margin-bottom: 1rem;
      }

      .apply-btn:hover:not(:disabled) {
        background: #0056b3;
      }

      .apply-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .apply-info {
        font-size: 0.85rem;
        color: #666;
      }

      .apply-info p {
        margin: 0 0 0.5rem 0;
      }

      .apply-info ul {
        margin: 0;
        padding-left: 1.2rem;
      }

      .apply-info li {
        margin-bottom: 0.25rem;
      }

      .project-meta {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
      }

      .project-meta h3 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.1rem;
      }

      .meta-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
      }

      .meta-item:last-child {
        margin-bottom: 0;
      }

      .meta-label {
        color: #666;
        font-size: 0.9rem;
      }

      .meta-value {
        color: #333;
        font-weight: 500;
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
        .project-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .apply-card {
          position: static;
          order: -1;
        }

        .project-main h1 {
          font-size: 1.5rem;
        }
      }
    `,
  ],
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isApplying = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: Projectservice
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadProject(+id);
    }
  }

  loadProject(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.router.navigate(['/projects']);
      },
    });
  }

  applyToProject(): void {
    if (!this.project) return;

    this.isApplying = true;
    this.projectService.applyToProject(this.project.id).subscribe({
      next: (assessmentId) => {
        this.isApplying = false;
        alert('Application submitted successfully! You can now take the assessment.');
        // Optionally navigate to assessment page
      },
      error: (error) => {
        this.isApplying = false;
        alert(error.error?.message || 'Failed to apply to project');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  formatProjectType(type: ProjectType): string {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
