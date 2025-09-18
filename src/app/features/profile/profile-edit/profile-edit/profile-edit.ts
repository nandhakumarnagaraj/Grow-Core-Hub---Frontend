// src/app/features/profile/profile-edit/profile-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile-service';
import { FreelancerProfile } from '../../../../core/models/freelancer-profile';
import { ProfileUpdateRequest } from '../../../../core/models/profile-update-request';
import { Skill } from '../../../../core/models/skill';
import { Education } from '../../../../core/models/education';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="profile-edit-container">
      <div class="edit-header">
        <button class="back-btn" routerLink="/profile">← Back to Profile</button>
        <h1>Edit Profile</h1>
      </div>

      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" *ngIf="profileForm">
        <!-- Personal Information -->
        <div class="form-section">
          <h2>Personal Information</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                formControlName="phone"
                placeholder="Enter your phone number"
                class="form-input"
                [class.error]="isFieldInvalid('phone')"
              />
              <div *ngIf="isFieldInvalid('phone')" class="error-message">
                Please enter a valid phone number
              </div>
            </div>

            <div class="form-group">
              <label for="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                formControlName="dateOfBirth"
                class="form-input"
                [class.error]="isFieldInvalid('dateOfBirth')"
              />
            </div>

            <div class="form-group full-width">
              <label for="address">Address</label>
              <textarea
                id="address"
                formControlName="address"
                placeholder="Enter your full address"
                class="form-input"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div class="form-section">
          <div class="section-header">
            <h2>Skills & Expertise</h2>
            <button type="button" class="btn btn-outline" (click)="addSkill()">+ Add Skill</button>
          </div>

          <div class="skills-container" formArrayName="skills">
            <div
              class="skill-form-group"
              *ngFor="let skill of skillsFormArray.controls; let i = index"
              [formGroupName]="i"
            >
              <div class="skill-header">
                <h4>Skill {{ i + 1 }}</h4>
                <button
                  type="button"
                  class="btn-remove"
                  (click)="removeSkill(i)"
                  *ngIf="skillsFormArray.length > 1"
                >
                  Remove
                </button>
              </div>
              <div class="skill-form-grid">
                <div class="form-group">
                  <label>Skill Name</label>
                  <input
                    type="text"
                    formControlName="name"
                    placeholder="e.g., JavaScript, Data Entry, Writing"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Proficiency Level</label>
                  <select formControlName="proficiency" class="form-input">
                    <option value="">Select Level</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    formControlName="yearsOfExperience"
                    placeholder="0"
                    min="0"
                    max="50"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <div class="empty-skills" *ngIf="skillsFormArray.length === 0">
              <div class="empty-content">
                <div class="empty-icon">🛠️</div>
                <p>No skills added yet</p>
                <button type="button" class="btn btn-primary" (click)="addSkill()">
                  Add Your First Skill
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Education Section -->
        <div class="form-section">
          <div class="section-header">
            <h2>Education</h2>
            <button type="button" class="btn btn-outline" (click)="addEducation()">
              + Add Education
            </button>
          </div>

          <div class="education-container" formArrayName="education">
            <div
              class="education-form-group"
              *ngFor="let education of educationFormArray.controls; let i = index"
              [formGroupName]="i"
            >
              <div class="education-header">
                <h4>Education {{ i + 1 }}</h4>
                <button
                  type="button"
                  class="btn-remove"
                  (click)="removeEducation(i)"
                  *ngIf="educationFormArray.length > 1"
                >
                  Remove
                </button>
              </div>
              <div class="education-form-grid">
                <div class="form-group">
                  <label>Degree/Certification</label>
                  <input
                    type="text"
                    formControlName="degree"
                    placeholder="e.g., Bachelor of Science, High School Diploma"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    formControlName="institution"
                    placeholder="School/University/College name"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Field of Study</label>
                  <input
                    type="text"
                    formControlName="fieldOfStudy"
                    placeholder="e.g., Computer Science, Business"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Graduation Year</label>
                  <input
                    type="number"
                    formControlName="graduationYear"
                    placeholder="2020"
                    min="1950"
                    [max]="currentYear + 10"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <div class="empty-education" *ngIf="educationFormArray.length === 0">
              <div class="empty-content">
                <div class="empty-icon">🎓</div>
                <p>No education added yet</p>
                <button type="button" class="btn btn-primary" (click)="addEducation()">
                  Add Education
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Section -->
        <div class="form-section">
          <div class="section-header">
            <h2>Documents</h2>
            <button type="button" class="btn btn-outline" (click)="triggerFileUpload()">
              + Upload Document
            </button>
          </div>

          <input
            #fileInput
            type="file"
            (change)="onFileSelect($event)"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
            style="display: none"
          />

          <div class="documents-container">
            <div class="document-item" *ngFor="let doc of uploadedDocuments; let i = index">
              <div class="document-icon">
                <ng-container [ngSwitch]="getFileType(doc.fileName)">
                  <span *ngSwitchCase="'pdf'">📄</span>
                  <span *ngSwitchCase="'doc'">📝</span>
                  <span *ngSwitchCase="'image'">🖼️</span>
                  <span *ngSwitchDefault>📁</span>
                </ng-container>
              </div>
              <div class="document-content">
                <h4>{{ doc.type }}</h4>
                <p class="document-name">{{ doc.fileName }}</p>
                <span class="upload-date">{{ doc.uploadedAt | date : 'short' }}</span>
              </div>
              <button
                type="button"
                class="btn-remove"
                (click)="removeDocument(i)"
                title="Remove document"
              >
                🗑️
              </button>
            </div>

            <div class="upload-area" *ngIf="uploadedDocuments.length === 0">
              <div class="upload-content" (click)="triggerFileUpload()">
                <div class="upload-icon">📁</div>
                <h4>Upload Documents</h4>
                <p>Click here or drag files to upload verification documents</p>
                <span class="upload-info">Supported: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-outline" routerLink="/profile">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || saving">
            <span *ngIf="saving" class="loading-spinner"></span>
            {{ saving ? 'Saving...' : 'Save Changes' }}
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

      <!-- Loading State -->
      <div *ngIf="!profileForm" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-edit-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
      }

      .edit-header {
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

      .edit-header h1 {
        margin: 0;
        color: #333;
        font-size: 2rem;
      }

      .form-section {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .form-section h2 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 1.3rem;
        border-bottom: 2px solid #e1e5e9;
        padding-bottom: 0.5rem;
      }

      .section-header h2 {
        margin-bottom: 0;
        border-bottom: none;
        padding-bottom: 0;
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

      .skills-container,
      .education-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .skill-form-group,
      .education-form-group {
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        padding: 1.5rem;
        border-radius: 8px;
      }

      .skill-header,
      .education-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .skill-header h4,
      .education-header h4 {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
      }

      .skill-form-grid,
      .education-form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .btn-remove {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background 0.3s ease;
      }

      .btn-remove:hover {
        background: #c82333;
      }

      .empty-skills,
      .empty-education {
        text-align: center;
        padding: 3rem 2rem;
        border: 2px dashed #e1e5e9;
        border-radius: 8px;
      }

      .empty-content .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .empty-content p {
        color: #666;
        margin-bottom: 1.5rem;
      }

      .documents-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .document-item {
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

      .document-content h4 {
        margin: 0 0 0.25rem 0;
        color: #333;
        font-size: 1rem;
      }

      .document-name {
        margin: 0 0 0.25rem 0;
        color: #666;
        font-size: 0.9rem;
      }

      .upload-date {
        color: #999;
        font-size: 0.8rem;
      }

      .upload-area {
        border: 2px dashed #e1e5e9;
        border-radius: 8px;
        transition: border-color 0.3s ease;
      }

      .upload-area:hover {
        border-color: #007bff;
      }

      .upload-content {
        text-align: center;
        padding: 3rem 2rem;
        cursor: pointer;
      }

      .upload-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .upload-content h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .upload-content p {
        margin: 0 0 1rem 0;
        color: #666;
      }

      .upload-info {
        color: #999;
        font-size: 0.8rem;
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

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        color: #666;
      }

      .loading .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #007bff;
        margin-bottom: 1rem;
      }

      @media (max-width: 768px) {
        .profile-edit-container {
          padding: 1rem;
        }

        .section-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .skill-form-grid,
        .education-form-grid {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column-reverse;
        }

        .skill-header,
        .education-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;
  profile: FreelancerProfile | null = null;
  uploadedDocuments: any[] = [];
  saving = false;
  errorMessage = '';
  successMessage = '';
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.uploadedDocuments = [...profile.documents];
        this.initializeForm();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.initializeForm(); // Initialize with empty form
      },
    });
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      phone: [this.profile?.phone || '', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      dateOfBirth: [
        this.profile?.dateOfBirth
          ? new Date(this.profile.dateOfBirth).toISOString().split('T')[0]
          : '',
      ],
      address: [this.profile?.address || ''],
      skills: this.fb.array(this.initializeSkills()),
      education: this.fb.array(this.initializeEducation()),
    });
  }

  initializeSkills(): FormGroup[] {
    if (this.profile?.skills && this.profile.skills.length > 0) {
      return this.profile.skills.map((skill) => this.createSkillFormGroup(skill));
    }
    return [this.createSkillFormGroup()];
  }

  initializeEducation(): FormGroup[] {
    if (this.profile?.education && this.profile.education.length > 0) {
      return this.profile.education.map((edu) => this.createEducationFormGroup(edu));
    }
    return [this.createEducationFormGroup()];
  }

  createSkillFormGroup(skill?: Skill): FormGroup {
    return this.fb.group({
      name: [skill?.name || '', Validators.required],
      proficiency: [skill?.proficiency || '', Validators.required],
      yearsOfExperience: [skill?.yearsOfExperience || 0, [Validators.required, Validators.min(0)]],
    });
  }

  createEducationFormGroup(education?: Education): FormGroup {
    return this.fb.group({
      degree: [education?.degree || '', Validators.required],
      institution: [education?.institution || '', Validators.required],
      fieldOfStudy: [education?.fieldOfStudy || '', Validators.required],
      graduationYear: [
        education?.graduationYear || '',
        [Validators.required, Validators.min(1950), Validators.max(this.currentYear + 10)],
      ],
    });
  }

  get skillsFormArray(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  get educationFormArray(): FormArray {
    return this.profileForm.get('education') as FormArray;
  }

  addSkill(): void {
    this.skillsFormArray.push(this.createSkillFormGroup());
  }

  removeSkill(index: number): void {
    this.skillsFormArray.removeAt(index);
  }

  addEducation(): void {
    this.educationFormArray.push(this.createEducationFormGroup());
  }

  removeEducation(index: number): void {
    this.educationFormArray.removeAt(index);
  }

  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          this.errorMessage = `File ${file.name} is too large. Maximum size is 5MB.`;
          continue;
        }

        // In a real application, you would upload to a server here
        const document = {
          type: this.getDocumentType(file.name),
          fileName: file.name,
          fileUrl: URL.createObjectURL(file), // Temporary URL for preview
          uploadedAt: new Date().toISOString(),
        };

        this.uploadedDocuments.push(document);
      }
    }
    event.target.value = ''; // Clear the input
  }

  removeDocument(index: number): void {
    this.uploadedDocuments.splice(index, 1);
  }

  getDocumentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'Image';
      default:
        return 'Document';
    }
  }

  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'doc';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'file';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.saving) {
      this.saving = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.profileForm.value;
      const updateRequest: ProfileUpdateRequest = {
        phone: formValue.phone,
        dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined,
        address: formValue.address,
        skills: formValue.skills.filter((skill: any) => skill.name && skill.proficiency),
        education: formValue.education.filter((edu: any) => edu.degree && edu.institution),
        documents: this.uploadedDocuments,
      };

      this.profileService.updateProfile(updateRequest).subscribe({
        next: (updatedProfile) => {
          this.saving = false;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (error) => {
          this.saving = false;
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        },
      });
    }
  }
}
