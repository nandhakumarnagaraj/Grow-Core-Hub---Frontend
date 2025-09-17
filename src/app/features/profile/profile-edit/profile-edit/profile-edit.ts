import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile-service';
import { FreelancerProfile } from '../../../../core/models/freelancer-profile';
import { VerificationStatus } from '../../../../core/models/verification-status';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-view-container" *ngIf="profile; else loading">
      <div class="profile-header">
        <div class="profile-info">
          <div class="profile-avatar">{{ profile.name?.charAt(0) || 'U' }}</div>
          <div class="profile-details">
            <h1>{{ profile.name || 'User' }}</h1>
            <p class="profile-email">{{ profile.email }}</p>
            <div class="verification-status" [class]="'status-' + (profile.verificationStatus || 'pending').toLowerCase()">
              <span class="status-icon">{{ getStatusIcon(profile.verificationStatus) }}</span>
              {{ formatVerificationStatus(profile.verificationStatus) }}
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-primary" routerLink="/profile/edit">
            Edit Profile
          </button>
        </div>
      </div>

      <div class="profile-content">
        <!-- Basic Information -->
        <div class="info-card">
          <h2>Basic Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Phone:</span>
              <span class="value">{{ profile.phone || 'Not provided' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date of Birth:</span>
              <span class="value">{{ profile.dateOfBirth | date : 'longDate' || 'Not provided' }}</span>
            </div>
            <div class="info-item" *ngIf="profile.address">
              <span class="label">Address:</span>
              <span class="value">{{ profile.address }}</span>
            </div>
            <div class="info-item" *ngIf="profile.rating">
              <span class="label">Rating:</span>
              <span class="value rating">
                {{ profile.rating }}/5
                <span class="stars">{{ getStars(profile.rating) }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="info-card">
          <div class="card-header">
            <h2>Skills</h2>
            <span class="count-badge">{{ profile.skills.length }}</span>
          </div>
          <div class="skills-grid" *ngIf="profile.skills.length > 0; else noSkills">
            <div class="skill-item" *ngFor="let skill of profile.skills">
              <div class="skill-header">
                <h3>{{ skill.name }}</h3>
                <span class="skill-level" [class]="'level-' + skill.proficiency.toLowerCase()">
                  {{ skill.proficiency }}
                </span>
              </div>
              <div class="skill-experience">
                <span class="experience-text">{{ skill.yearsOfExperience }} years experience</span>
                <div class="experience-bar">
                  <div class="experience-fill" [style.width.%]="getExperiencePercentage(skill.yearsOfExperience)"></div>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noSkills>
            <div class="empty-state">
              <p>No skills added yet.</p>
              <button class="btn btn-outline" routerLink="/profile/edit">Add Skills</button>
            </div>
          </ng-template>
        </div>

        <!-- Education -->
        <div class="info-card">
          <div class="card-header">
            <h2>Education</h2>
            <span class="count-badge">{{ profile.education.length }}</span>
          </div>
          <div class>
            