// src/app/features/projects/project-list/project-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Project } from '../../../../core/models/project';
import { ProjectType } from '../../../../core/models/project-type';
import { Projectservice } from '../../../../core/services/projectservice';
import { ProjectStatus } from '../../../../core/models/project-status';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="projects-container">
      <div class="projects-header">
        <h1>Available Projects</h1>
        <div class="filters">
          <select [(ngModel)]="selectedType" (change)="filterProjects()" class="filter-select">
            <option value="">All Types</option>
            <option *ngFor="let type of projectTypes" [value]="type">
              {{ formatProjectType(type) }}
            </option>
          </select>
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="eligibleOnly" (change)="filterProjects()" />
            Show only eligible projects
          </label>
        </div>
      </div>

      <div class="projects-grid" *ngIf="projects.length > 0; else noProjects">
        <div class="project-card" *ngFor="let project of projects">
          <div class="project-header">
            <h3>{{ project.title }}</h3>
            <span class="project-type">{{ formatProjectType(project.projectType) }}</span>
          </div>

          <p class="project-description">{{ project.description || 'No description available' }}</p>

          <div class="project-details">
            <div class="detail-item">
              <span class="label">Payout:</span>
              <span class="value">\${{ project.payoutAmount }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Billing Cycle:</span>
              <span class="value">{{ project.billingCycleDays }} days</span>
            </div>
            <div class="detail-item">
              <span class="label">Min Score:</span>
              <span class="value">{{ project.minScore }}%</span>
            </div>
          </div>

          <div class="project-actions">
            <button class="btn btn-outline" [routerLink]="['/projects', project.id]">
              View Details
            </button>
            <button
              class="btn btn-primary"
              (click)="applyToProject(project.id)"
              [disabled]="isApplying"
            >
              {{ isApplying ? 'Applying...' : 'Apply Now' }}
            </button>
          </div>
        </div>
      </div>

      <ng-template #noProjects>
        <div class="no-projects">
          <h3>No projects found</h3>
          <p>Check back later for new opportunities!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .projects-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .projects-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .projects-header h1 {
        margin: 0;
        color: #333;
      }

      .filters {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .filter-select {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
      }

      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .project-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid #e1e5e9;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .project-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
        gap: 1rem;
      }

      .project-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.2rem;
        line-height: 1.3;
      }

      .project-type {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        white-space: nowrap;
      }

      .project-description {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .project-details {
        margin-bottom: 1.5rem;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .detail-item:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #666;
        font-size: 0.9rem;
      }

      .value {
        color: #333;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .project-actions {
        display: flex;
        gap: 0.75rem;
      }

      .btn {
        flex: 1;
        padding: 0.75rem 1rem;
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

      .btn-outline {
        background: transparent;
        border: 1px solid #007bff;
        color: #007bff;
      }

      .btn-outline:hover {
        background: #007bff;
        color: white;
      }

      .no-projects {
        text-align: center;
        padding: 3rem 1rem;
        color: #666;
      }

      .no-projects h3 {
        margin-bottom: 1rem;
        color: #333;
      }

      @media (max-width: 768px) {
        .projects-header {
          flex-direction: column;
          align-items: stretch;
        }

        .filters {
          justify-content: space-between;
        }

        .projects-grid {
          grid-template-columns: 1fr;
        }

        .project-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  projectTypes = Object.values(ProjectType);
  selectedType: ProjectType | '' = '';
  eligibleOnly = false;
  isApplying = false;

  constructor(private projectService: Projectservice) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    const projectType = this.selectedType || undefined;
    this.projectService.getAllProjects(projectType, this.eligibleOnly).subscribe({
      next: (projects) => {
        this.projects = projects.filter((p) => p.status === ProjectStatus.ACTIVE);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      },
    });
  }

  filterProjects(): void {
    this.loadProjects();
  }

  applyToProject(projectId: number): void {
    this.isApplying = true;
    this.projectService.applyToProject(projectId).subscribe({
      next: (assessmentId) => {
        this.isApplying = false;
        alert('Application submitted successfully! You can now take the assessment.');
        // Optionally navigate to assessment
      },
      error: (error) => {
        this.isApplying = false;
        alert(error.error?.message || 'Failed to apply to project');
      },
    });
  }

  formatProjectType(type: ProjectType): string {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
