import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Authservice } from '../../../core/services/authservice';
import { ApplicationService } from '../../../core/services/application-service';
import { WorkSessionService } from '../../../core/services/work-session-service';
import { Application } from '../../../core/models/application';
import { WorkSession } from '../../../core/models/work-session';
import { UserRole } from '../../../core/models/user-role';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="welcome-section">
          <h1>Welcome back, {{ currentUser?.name }}!</h1>
          <p class="welcome-text">Here's what's happening with your projects today.</p>
        </div>
        <div class="user-info">
          <div class="user-avatar">{{ currentUser?.name?.charAt(0) }}</div>
          <div class="user-details">
            <span class="user-name">{{ currentUser?.name }}</span>
            <span class="user-role">{{ currentUser?.role }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="action-card" routerLink="/projects">
          <div class="action-icon">🔍</div>
          <h3>Browse Projects</h3>
          <p>Find new opportunities</p>
        </div>
        <div class="action-card" routerLink="/profile">
          <div class="action-icon">👤</div>
          <h3>Update Profile</h3>
          <p>Keep your skills current</p>
        </div>
        <div class="action-card" *ngIf="activeSession" (click)="stopWork()">
          <div class="action-icon">⏹️</div>
          <h3>Stop Work</h3>
          <p>End current session</p>
        </div>
      </div>

      <!-- Work Timer (if active session) -->
      <div class="work-timer" *ngIf="activeSession">
        <div class="timer-card">
          <h3>Active Work Session</h3>
          <div class="project-name">{{ activeSession.projectTitle }}</div>
          <div class="timer-display">{{ currentTimer }}</div>
          <button class="btn btn-danger" (click)="stopWork()">Stop Work Session</button>
        </div>
      </div>

      <div class="dashboard-content">
        <!-- Applications Overview -->
        <div class="applications-section">
          <h2>Your Applications</h2>
          <div class="applications-grid" *ngIf="applications.length > 0; else noApplications">
            <div class="application-card" *ngFor="let app of applications">
              <div class="app-header">
                <h3>{{ app.projectTitle }}</h3>
                <span class="status-badge" [class]="'status-' + app.status.toLowerCase()">
                  {{ formatStatus(app.status) }}
                </span>
              </div>
              <div class="app-meta">
                <p>Applied: {{ app.createdAt | date : 'short' }}</p>
              </div>
              <div class="app-actions" *ngIf="app.status === 'ELIGIBLE'">
                <button class="btn btn-primary" (click)="signAgreement(app.id)">
                  Sign Agreement
                </button>
              </div>
            </div>
          </div>
          <ng-template #noApplications>
            <div class="empty-state">
              <p>
                No applications yet. <a routerLink="/projects">Browse projects</a> to get started!
              </p>
            </div>
          </ng-template>
        </div>

        <!-- Recent Work Sessions -->
        <div class="sessions-section">
          <h2>Recent Work Sessions</h2>
          <div class="sessions-list" *ngIf="recentSessions.length > 0; else noSessions">
            <div class="session-item" *ngFor="let session of recentSessions">
              <div class="session-info">
                <h4>{{ session.projectTitle }}</h4>
                <p>{{ session.startTime | date : 'short' }}</p>
              </div>
              <div class="session-duration">
                <span>{{ session.hours || 0 }} hours</span>
              </div>
            </div>
          </div>
          <ng-template #noSessions>
            <div class="empty-state">
              <p>No work sessions recorded yet.</p>
            </div>
          </ng-template>
        </div>

        <!-- Today's Summary -->
        <div class="summary-section">
          <h2>Today's Summary</h2>
          <div class="summary-cards">
            <div class="summary-card">
              <div class="summary-icon">⏰</div>
              <div class="summary-content">
                <h3>{{ todayHours | number : '1.1-1' }}</h3>
                <p>Hours Worked</p>
              </div>
            </div>
            <div class="summary-card">
              <div class="summary-icon">📋</div>
              <div class="summary-content">
                <h3>{{ applications.length }}</h3>
                <p>Active Applications</p>
              </div>
            </div>
            <div class="summary-card">
              <div class="summary-icon">✅</div>
              <div class="summary-content">
                <h3>{{ completedApplications }}</h3>
                <p>Completed Projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 12px;
        color: white;
      }

      .welcome-section h1 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
      }

      .welcome-text {
        margin: 0;
        opacity: 0.9;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .user-details {
        display: flex;
        flex-direction: column;
      }

      .user-name {
        font-weight: 600;
      }

      .user-role {
        opacity: 0.8;
        font-size: 0.9rem;
      }

      .quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .action-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s ease;
        text-decoration: none;
        color: inherit;
      }

      .action-card:hover {
        transform: translateY(-2px);
      }

      .action-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .action-card h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .action-card p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .work-timer {
        margin-bottom: 2rem;
      }

      .timer-card {
        background: #e8f5e8;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        border-left: 4px solid #28a745;
      }

      .timer-card h3 {
        margin: 0 0 0.5rem 0;
        color: #155724;
      }

      .project-name {
        color: #666;
        margin-bottom: 1rem;
      }

      .timer-display {
        font-size: 2.5rem;
        font-weight: bold;
        color: #28a745;
        margin: 1rem 0;
      }

      .dashboard-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .applications-section,
      .sessions-section,
      .summary-section {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .summary-section {
        grid-column: 1 / -1;
      }

      .section h2 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .applications-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .application-card {
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        padding: 1rem;
      }

      .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .app-header h3 {
        margin: 0;
        font-size: 1rem;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .status-applied {
        background: #e3f2fd;
        color: #1976d2;
      }

      .status-eligible {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .status-active {
        background: #fff3e0;
        color: #f57c00;
      }

      .status-completed {
        background: #f3e5f5;
        color: #7b1fa2;
      }

      .app-meta p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .app-actions {
        margin-top: 1rem;
      }

      .sessions-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .session-info h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.9rem;
      }

      .session-info p {
        margin: 0;
        color: #666;
        font-size: 0.8rem;
      }

      .session-duration {
        color: #28a745;
        font-weight: 500;
      }

      .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }

      .summary-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .summary-icon {
        font-size: 1.5rem;
      }

      .summary-content h3 {
        margin: 0;
        color: #333;
        font-size: 1.5rem;
      }

      .summary-content p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .empty-state {
        text-align: center;
        color: #666;
        padding: 2rem;
      }

      .empty-state a {
        color: #007bff;
        text-decoration: none;
      }

      .btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 500;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-danger {
        background: #dc3545;
        color: white;
      }

      .btn:hover {
        opacity: 0.9;
      }

      @media (max-width: 768px) {
        .dashboard-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .dashboard-content {
          grid-template-columns: 1fr;
        }

        .summary-cards {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  applications: Application[] = [];
  recentSessions: WorkSession[] = [];
  activeSession: WorkSession | null = null;
  currentTimer = '00:00:00';
  todayHours = 0;
  completedApplications = 0;

  constructor(
    private authService: Authservice,
    private applicationService: ApplicationService,
    private workSessionService: WorkSessionService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
    this.subscribeToWorkSession();
  }

  loadDashboardData(): void {
    // Load applications
    this.applicationService.getUserApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.completedApplications = apps.filter((app) => app.status === 'COMPLETED').length;
      },
      error: (error) => console.error('Error loading applications:', error),
    });

    // Load recent work sessions
    this.workSessionService.getUserWorkSessions().subscribe({
      next: (sessions) => {
        this.recentSessions = sessions.slice(0, 5); // Latest 5 sessions
      },
      error: (error) => console.error('Error loading sessions:', error),
    });

    // Load today's hours
    this.workSessionService.getTodayHours().subscribe({
      next: (hours) => {
        this.todayHours = hours;
      },
      error: (error) => console.error('Error loading today hours:', error),
    });
  }

  subscribeToWorkSession(): void {
    this.workSessionService.activeSession$.subscribe((session) => {
      this.activeSession = session;
    });

    this.workSessionService.timer$.subscribe((timer) => {
      this.currentTimer = timer;
    });
  }

  stopWork(): void {
    if (this.activeSession) {
      const stopRequest = {
        sessionId: this.activeSession.id,
        notes: '',
      };

      this.workSessionService.stopWorkSession(stopRequest).subscribe({
        next: () => {
          this.loadDashboardData(); // Refresh data
        },
        error: (error) => {
          console.error('Error stopping work session:', error);
          alert('Failed to stop work session');
        },
      });
    }
  }

  signAgreement(applicationId: number): void {
    this.applicationService.signAgreement(applicationId).subscribe({
      next: () => {
        alert('Agreement signed successfully!');
        this.loadDashboardData();
      },
      error: (error) => {
        console.error('Error signing agreement:', error);
        alert('Failed to sign agreement');
      },
    });
  }

  formatStatus(status: string): string {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
