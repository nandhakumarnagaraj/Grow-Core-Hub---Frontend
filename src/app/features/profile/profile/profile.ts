// src/app/features/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile-service';
import { FreelancerProfile } from '../../../core/models/freelancer-profile';
import { Skill } from '../../../core/models/skill';
import { Education } from '../../../core/models/education';
import { VerificationStatus } from '../../../core/models/verification-status';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>My Profile</h1>
        <div
          class="verification-status"
          [class]="'status-' + (profile?.verificationStatus || 'pending').toLowerCase()"
        >
          <span class="status-icon">{{ getStatusIcon(profile?.verificationStatus) }}</span>
          {{ formatVerificationStatus(profile?.verificationStatus) }}
        </div>
      </div>

      <div class="profile-content" *ngIf="profile; else loading">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
          <!-- Basic Information -->
          <div class="form-section">
            <h2>Basic Information</h2>
            <div class="form-row">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  [value]="profile.name"
                  readonly
                  class="form-input readonly"
                />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  [value]="profile.email"
                  readonly
                  class="form-input readonly"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input id="phone" type="tel" formControlName="phone" class="form-input" />
              </div>
              <div class="form-group">
                <label for="dateOfBirth">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  formControlName="dateOfBirth"
                  class="form-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="address">Address</label>
              <textarea
                id="address"
                formControlName="address"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="form-section">
            <div class="section-header">
              <h2>Skills</h2>
              <button type="button" class="btn btn-secondary" (click)="addSkill()">
                Add Skill
              </button>
            </div>
            <div formArrayName="skills" class="skills-list">
              <div
                *ngFor="let skillForm of skillsFormArray.controls; let i = index"
                [formGroupName]="i"
                class="skill-item"
              >
                <div class="skill-form-row">
                  <div class="form-group">
                    <input
                      type="text"
                      formControlName="name"
                      placeholder="Skill name"
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <select formControlName="proficiency" class="form-select">
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <input
                      type="number"
                      formControlName="yearsOfExperience"
                      placeholder="Years"
                      class="form-input"
                      min="0"
                    />
                  </div>
                  <button type="button" class="btn btn-danger-outline" (click)="removeSkill(i)">
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="skillsFormArray.length === 0" class="empty-state">
              <p>No skills added yet. Click "Add Skill" to get started.</p>
            </div>
          </div>

          <!-- Education Section -->
          <div class="form-section">
            <div class="section-header">
              <h2>Education</h2>
              <button type="button" class="btn btn-secondary" (click)="addEducation()">
                Add Education
              </button>
            </div>
            <div formArrayName="education" class="education-list">
              <div
                *ngFor="let eduForm of educationFormArray.controls; let i = index"
                [formGroupName]="i"
                class="education-item"
              >
                <div class="education-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Degree</label>
                      <input type="text" formControlName="degree" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>Institution</label>
                      <input type="text" formControlName="institution" class="form-input" />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Field of Study</label>
                      <input type="text" formControlName="fieldOfStudy" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>Graduation Year</label>
                      <input
                        type="number"
                        formControlName="graduationYear"
                        class="form-input"
                        [min]="1950"
                        [max]="2030"
                      />
                    </div>
                  </div>
                  <button type="button" class="btn btn-danger-outline" (click)="removeEducation(i)">
                    Remove Education
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="educationFormArray.length === 0" class="empty-state">
              <p>No education records added yet. Click "Add Education" to get started.</p>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="form-section">
            <h2>Documents</h2>
            <div class="documents-upload">
              <div class="upload-area" (click)="fileInput.click()">
                <div class="upload-icon">📄</div>
                <p>Click to upload documents</p>
                <p class="upload-hint">PDF, DOC, JPG, PNG (Max 10MB)</p>
                <input
                  #fileInput
                  type="file"
                  multiple
                  (change)="onFileSelect($event)"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style="display: none;"
                />
              </div>
            </div>
            <div class="documents-list" *ngIf="profile.documents && profile.documents.length > 0">
              <div *ngFor="let doc of profile.documents" class="document-item">
                <div class="doc-info">
                  <span class="doc-name">{{ doc.fileName }}</span>
                  <span class="doc-type">{{ doc.type }}</span>
                </div>
                <div class="doc-actions">
                  <a [href]="doc.fileUrl" target="_blank" class="btn btn-sm btn-outline">View</a>
                  <button
                    type="button"
                    class="btn btn-sm btn-danger-outline"
                    (click)="removeDocument(doc)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="resetForm()">Cancel</button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="profileForm.invalid || loading"
            >
              <span *ngIf="loading" class="loading-spinner"></span>
              {{ loading ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>
        </form>
      </div>

      <ng-template #loading>
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .profile-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }

      .profile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .profile-header h1 {
        margin: 0;
        color: #333;
      }

      .verification-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .status-pending {
        background: #fff3cd;
        color: #856404;
      }

      .status-approved {
        background: #d4edda;
        color: #155724;
      }

      .status-rejected {
        background: #f8d7da;
        color: #721c24;
      }

      .status-requires-resubmission {
        background: #ffeaa7;
        color: #6c5ce7;
      }

      .profile-form {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .form-section {
        padding: 2rem;
        border-bottom: 1px solid #e1e5e9;
      }

      .form-section:last-child {
        border-bottom: none;
      }

      .form-section h2 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 1.3rem;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .section-header h2 {
        margin: 0;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-group label {
        margin-bottom: 0.5rem;
        color: #555;
        font-weight: 500;
      }

      .form-input,
      .form-select,
      .form-textarea {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .form-input:focus,
      .form-select:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .form-input.readonly {
        background: #f8f9fa;
        color: #666;
      }

      .skills-list,
      .education-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .skill-item,
      .education-item {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 6px;
        border: 1px solid #e1e5e9;
      }

      .skill-form-row {
        display: grid;
        grid-template-columns: 1fr 120px 80px auto;
        gap: 1rem;
        align-items: end;
      }

      .education-form .form-row {
        margin-bottom: 1rem;
      }

      .documents-upload {
        margin-bottom: 1rem;
      }

      .upload-area {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.3s ease;
      }

      .upload-area:hover {
        border-color: #007bff;
      }

      .upload-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .upload-hint {
        color: #666;
        font-size: 0.9rem;
        margin: 0.5rem 0 0 0;
      }

      .documents-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .document-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e1e5e9;
      }

      .doc-info {
        display: flex;
        flex-direction: column;
      }

      .doc-name {
        font-weight: 500;
        color: #333;
      }

      .doc-type {
        font-size: 0.8rem;
        color: #666;
      }

      .doc-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
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

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #545b62;
      }

      .btn-danger-outline {
        background: transparent;
        border: 1px solid #dc3545;
        color: #dc3545;
      }

      .btn-danger-outline:hover {
        background: #dc3545;
        color: white;
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

      .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        padding: 2rem;
        background: #f8f9fa;
      }

      .empty-state {
        text-align: center;
        padding: 2rem;
        color: #666;
        font-style: italic;
      }

      .alert {
        padding: 1rem;
        border-radius: 4px;
        margin-top: 1rem;
      }

      .alert-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .alert-error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
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
          gap: 1rem;
          align-items: flex-start;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .skill-form-row {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .form-actions {
          flex-direction: column;
        }

        .document-item {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .doc-actions {
          align-self: stretch;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  profile: FreelancerProfile | null = null;
  profileForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      phone: [''],
      dateOfBirth: [''],
      address: [''],
      skills: this.fb.array([]),
      education: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.populateForm(profile);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile';
        this.loading = false;
      },
    });
  }

  populateForm(profile: FreelancerProfile): void {
    this.profileForm.patchValue({
      phone: profile.phone || '',
      dateOfBirth: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
        : '',
      address: profile.address || '',
    });

    // Populate skills
    const skillsArray = this.skillsFormArray;
    skillsArray.clear();
    profile.skills.forEach((skill) => {
      skillsArray.push(this.createSkillForm(skill));
    });

    // Populate education
    const educationArray = this.educationFormArray;
    educationArray.clear();
    profile.education.forEach((edu) => {
      educationArray.push(this.createEducationForm(edu));
    });
  }

  get skillsFormArray(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  get educationFormArray(): FormArray {
    return this.profileForm.get('education') as FormArray;
  }

  createSkillForm(skill?: Skill): FormGroup {
    return this.fb.group({
      name: [skill?.name || '', Validators.required],
      proficiency: [skill?.proficiency || '', Validators.required],
      yearsOfExperience: [skill?.yearsOfExperience || 0, [Validators.required, Validators.min(0)]],
    });
  }

  createEducationForm(education?: Education): FormGroup {
    return this.fb.group({
      degree: [education?.degree || '', Validators.required],
      institution: [education?.institution || '', Validators.required],
      fieldOfStudy: [education?.fieldOfStudy || '', Validators.required],
      graduationYear: [
        education?.graduationYear || '',
        [Validators.required, Validators.min(1950), Validators.max(2030)],
      ],
    });
  }

  addSkill(): void {
    this.skillsFormArray.push(this.createSkillForm());
  }

  removeSkill(index: number): void {
    this.skillsFormArray.removeAt(index);
  }

  addEducation(): void {
    this.educationFormArray.push(this.createEducationForm());
  }

  removeEducation(index: number): void {
    this.educationFormArray.removeAt(index);
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // In a real application, you would upload files to a server
      // For now, we'll just show a message
      alert(
        `Selected ${files.length} file(s). File upload functionality would be implemented here.`
      );
    }
  }

  removeDocument(doc: Document): void {
    if (confirm('Are you sure you want to remove this document?')) {
      // In a real application, you would call an API to remove the document
      alert('Document removal functionality would be implemented here.');
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.loading) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const formValue = this.profileForm.value;
      const updateRequest = {
        phone: formValue.phone,
        dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined,
        address: formValue.address,
        skills: formValue.skills,
        education: formValue.education,
        documents: this.profile?.documents || [],
      };

      this.profileService.updateProfile(updateRequest).subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;
          this.loading = false;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating profile:', error);
          this.errorMessage = 'Failed to update profile. Please try again.';
        },
      });
    }
  }

  resetForm(): void {
    if (this.profile) {
      this.populateForm(this.profile);
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  getStatusIcon(status?: VerificationStatus): string {
    switch (status) {
      case VerificationStatus.APPROVED:
        return '✅';
      case VerificationStatus.REJECTED:
        return '❌';
      case VerificationStatus.REQUIRES_RESUBMISSION:
        return '🔄';
      case VerificationStatus.PENDING:
      default:
        return '⏳';
    }
  }

  formatVerificationStatus(status?: VerificationStatus): string {
    if (!status) return 'Pending';

    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
