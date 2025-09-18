import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile-service';
import { FreelancerProfile } from '../../../../core/models/freelancer-profile';
import { VerificationStatus } from '../../../../core/models/verification-status';
import { StatusPipe } from '../../../../shared/pipes/status.pipe';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusPipe],
  template: `
    <div class="profile-container" *ngIf="profile; else loading">
      <div class="profile-header">
        <div class="profile-info">
          <div class="avatar">
            {{ profile.name?.charAt(0) || 'U' }}
          </div>
          <div class="user-details">
            <h1>{{ profile.name || 'User' }}</h1>
            <p class="email">{{ profile.email }}</p>
            <div
              class="verification-status"
              [class]="'status-' + profile.verificationStatus.toLowerCase()"
            >
              <span class="status-icon">
                <ng-container [ngSwitch]="profile.verificationStatus">
                  <span *ngSwitchCase="VerificationStatus.APPROVED">✅</span>
                  <span *ngSwitchCase="VerificationStatus.PENDING">⏳</span>
                  <span *ngSwitchCase="VerificationStatus.REJECTED">❌</span>
                  <span *ngSwitchDefault>📋</span>
                </ng-container>
              </span>
              {{ profile.verificationStatus | status }}
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-primary" routerLink="/profile/edit">Edit Profile</button>
          <div class="completion-status" *ngIf="!profile.completed">
            <span class="completion-icon">⚠️</span>
            <span>Profile Incomplete</span>
          </div>
        </div>
      </div>

      <!-- Profile Stats -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-value">{{ profile.rating || 'N/A' }}</div>
            <div class="stat-label">Rating</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🛠️</div>
          <div class="stat-content">
            <div class="stat-value">{{ profile.skills.length }}</div>
            <div class="stat-label">Skills</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <div class="stat-value">{{ profile.education.length }}</div>
            <div class="stat-label">Education</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📁</div>
          <div class="stat-content">
            <div class="stat-value">{{ profile.documents.length }}</div>
            <div class="stat-label">Documents</div>
          </div>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="info-section">
        <h2>Personal Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Full Name:</span>
            <span class="info-value">{{ profile.name || 'Not provided' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ profile.email || 'Not provided' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone:</span>
            <span class="info-value">{{ profile.phone || 'Not provided' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date of Birth:</span>
            <span class="info-value">
              {{ profile.dateOfBirth | date }}
            </span>
          </div>
          <div class="info-item full-width">
            <span class="info-label">Address:</span>
            <span class="info-value">{{ profile.address || 'Not provided' }}</span>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="skills-section" *ngIf="profile.skills.length > 0">
        <h2>Skills & Expertise</h2>
        <div class="skills-grid">
          <div class="skill-card" *ngFor="let skill of profile.skills">
            <div class="skill-header">
              <h3>{{ skill.name }}</h3>
              <span
                class="skill-proficiency"
                [class]="'proficiency-' + skill.proficiency.toLowerCase()"
              >
                {{ skill.proficiency }}
              </span>
            </div>
            <div class="skill-experience">
              <span class="experience-icon">🕐</span>
              <span
                >{{ skill.yearsOfExperience }}
                {{ skill.yearsOfExperience === 1 ? 'year' : 'years' }} experience</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Education Section -->
      <div class="education-section" *ngIf="profile.education.length > 0">
        <h2>Education</h2>
        <div class="education-list">
          <div class="education-card" *ngFor="let edu of profile.education">
            <div class="education-icon">🎓</div>
            <div class="education-content">
              <h3>{{ edu.degree }}</h3>
              <p class="institution">{{ edu.institution }}</p>
              <div class="education-details">
                <span class="field">{{ edu.fieldOfStudy }}</span>
                <span class="year">Class of {{ edu.graduationYear }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents Section -->
      <!-- <div class="documents-section" *ngIf="profile.documents.length > 0">
        <h2>Documents</h2>
        <div class="documents-grid">
          <div class="document-card" *ngFor="let doc of profile.documents">
            <div class="document-icon">📄</div>
            <div class="document-content">
              <h3>{{ doc.type }}</h3>
              <p class="document-filename">{{ doc.fileName }}</p>
              <div class="document-meta">
                <span class="upload-date">
                  Uploaded: {{ doc.uploadedAt | date : 'shortDate' }}
                </span>
              </div>
            </div>
            <div class="document-actions">
              <button class="btn-icon" (click)="downloadDocument(doc.fileUrl)" title="Download">
                📥
              </button>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Empty States -->
      <div class="empty-section" *ngIf="profile.skills.length === 0">
        <div class="empty-content">
          <div class="empty-icon">🛠️</div>
          <h3>No Skills Added</h3>
          <p>Add your skills to showcase your expertise to potential clients.</p>
          <button class="btn btn-primary" routerLink="/profile/edit">Add Skills</button>
        </div>
      </div>

      <div class="empty-section" *ngIf="profile.education.length === 0">
        <div class="empty-content">
          <div class="empty-icon">🎓</div>
          <h3>No Education Added</h3>
          <p>Add your educational background to build trust with clients.</p>
          <button class="btn btn-primary" routerLink="/profile/edit">Add Education</button>
        </div>
      </div>

      <div class="empty-section" *ngIf="profile.documents.length === 0">
        <div class="empty-content">
          <div class="empty-icon">📁</div>
          <h3>No Documents Uploaded</h3>
          <p>Upload verification documents to complete your profile.</p>
          <button class="btn btn-primary" routerLink="/profile/edit">Upload Documents</button>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .profile-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
      }

      .profile-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .profile-info {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
      }

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        flex-shrink: 0;
      }

      .user-details h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.8rem;
      }

      .email {
        margin: 0 0 1rem 0;
        color: #666;
        font-size: 1.1rem;
      }

      .verification-status {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .status-approved {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .status-pending {
        background: #fff3e0;
        color: #f57c00;
      }

      .status-rejected {
        background: #ffebee;
        color: #c62828;
      }

      .status-requires_resubmission {
        background: #fff3cd;
        color: #856404;
      }

      .profile-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-end;
      }

      .completion-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #f57c00;
        font-weight: 500;
      }

      .stats-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .stat-icon {
        font-size: 2rem;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 0.25rem;
      }

      .stat-label {
        color: #666;
        font-size: 0.9rem;
      }

      .info-section,
      .skills-section,
      .education-section,
      .documents-section {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .info-section h2,
      .skills-section h2,
      .education-section h2,
      .documents-section h2 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 1.3rem;
        border-bottom: 2px solid #e1e5e9;
        padding-bottom: 0.5rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .info-item.full-width {
        grid-column: 1 / -1;
      }

      .info-label {
        color: #666;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .info-value {
        color: #333;
        font-weight: 600;
      }

      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
      }

      .skill-card {
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        padding: 1.5rem;
        border-radius: 8px;
        transition: transform 0.2s ease;
      }

      .skill-card:hover {
        transform: translateY(-2px);
      }

      .skill-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .skill-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
      }

      .skill-proficiency {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .proficiency-beginner {
        background: #ffebee;
        color: #c62828;
      }

      .proficiency-intermediate {
        background: #fff3e0;
        color: #f57c00;
      }

      .proficiency-advanced {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .proficiency-expert {
        background: #e3f2fd;
        color: #1976d2;
      }

      .skill-experience {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        font-size: 0.9rem;
      }

      .education-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .education-card {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
      }

      .education-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .education-content h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.1rem;
      }

      .institution {
        margin: 0 0 0.75rem 0;
        color: #007bff;
        font-weight: 500;
      }

      .education-details {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: #666;
      }

      .documents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
      }

      .document-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
      }

      .document-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .document-content {
        flex: 1;
      }

      .document-content h3 {
        margin: 0 0 0.25rem 0;
        color: #333;
        font-size: 1rem;
      }

      .document-filename {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
      }

      .upload-date {
        color: #999;
        font-size: 0.8rem;
      }

      .btn-icon {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background 0.3s ease;
      }

      .btn-icon:hover {
        background: #e9ecef;
      }

      .empty-section {
        background: white;
        padding: 3rem 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .empty-content {
        text-align: center;
        max-width: 400px;
        margin: 0 auto;
      }

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .empty-content h3 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .empty-content p {
        margin: 0 0 2rem 0;
        color: #666;
        line-height: 1.6;
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
        .profile-container {
          padding: 1rem;
        }

        .profile-header {
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-actions {
          align-items: stretch;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .skills-grid {
          grid-template-columns: 1fr;
        }

        .documents-grid {
          grid-template-columns: 1fr;
        }

        .stats-section {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class ProfileViewComponent implements OnInit {
  profile: FreelancerProfile | null = null;

  readonly VerificationStatus = VerificationStatus;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      },
    });
  }

  downloadDocument(fileUrl: string): void {
    // In a real application, you would handle file downloads properly
    window.open(fileUrl, '_blank');
  }
}
