// src/app/features/work-sessions/session-history/session-history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkSessionService } from '../../../../core/services/work-session-service';
import { WorkSession } from '../../../../core/models/work-session';
import { SessionStatus } from '../../../../core/models/session-status';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { StatusPipe } from '../../../../shared/pipes/status.pipe';

@Component({
  selector: 'app-session-history',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DurationPipe, StatusPipe, FormsModule],
  template: `
    <div class="session-history-container">
      <div class="history-header">
        <div class="header-info">
          <h1>Work Session History</h1>
          <p class="header-subtitle">Track your work sessions and productivity over time</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalHours | number : '1.1-1' }}h</div>
              <div class="stat-label">Total Hours</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">{{ sessions.length }}</div>
              <div class="stat-label">Sessions</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-value">\${{ totalEarnings | number : '1.2-2' }}</div>
              <div class="stat-label">Estimated Earnings</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="filter-group">
            <label for="projectFilter">Project</label>
            <select id="projectFilter" [formControl]="projectFilter" class="filter-input">
              <option value="">All Projects</option>
              <option *ngFor="let project of uniqueProjects" [value]="project.id">
                {{ project.title }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="statusFilter">Status</label>
            <select id="statusFilter" [formControl]="statusFilter" class="filter-input">
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="dateFrom">From Date</label>
            <input type="date" id="dateFrom" [formControl]="dateFromFilter" class="filter-input" />
          </div>

          <div class="filter-group">
            <label for="dateTo">To Date</label>
            <input type="date" id="dateTo" [formControl]="dateToFilter" class="filter-input" />
          </div>

          <div class="filter-actions">
            <button class="btn btn-outline" (click)="clearFilters()">Clear</button>
            <button class="btn btn-primary" (click)="exportSessions()">Export</button>
          </div>
        </div>
      </div>

      <!-- Sessions List -->
      <div class="sessions-section" *ngIf="filteredSessions.length > 0; else noSessions">
        <!-- Date Groups -->
        <div class="date-group" *ngFor="let dateGroup of groupedSessions">
          <div class="date-header">
            <h3>{{ dateGroup.date | date : 'fullDate' }}</h3>
            <div class="date-stats">
              <span class="date-hours">{{ dateGroup.totalHours | number : '1.1-1' }}h total</span>
              <span class="date-sessions">{{ dateGroup.sessions.length }} sessions</span>
            </div>
          </div>

          <div class="sessions-list">
            <div class="session-card" *ngFor="let session of dateGroup.sessions">
              <div class="session-header">
                <div class="session-project">
                  <h4>{{ session.projectTitle || 'Project #' + session.projectId }}</h4>
                  <span class="session-status" [class]="'status-' + session.status.toLowerCase()">
                    {{ session.status | status }}
                  </span>
                </div>
                <div class="session-duration">
                  <span class="duration-value">
                    {{ getSessionDuration(session) | duration }}
                  </span>
                </div>
              </div>

              <div class="session-details">
                <div class="session-time">
                  <div class="time-info">
                    <span class="time-label">Start:</span>
                    <span class="time-value">{{ session.startTime | date : 'shortTime' }}</span>
                  </div>
                  <div class="time-info" *ngIf="session.endTime">
                    <span class="time-label">End:</span>
                    <span class="time-value">{{ session.endTime | date : 'shortTime' }}</span>
                  </div>
                  <div class="time-info" *ngIf="session.hours">
                    <span class="time-label">Hours:</span>
                    <span class="time-value">{{ session.hours | number : '1.2-2' }}h</span>
                  </div>
                </div>

                <div class="session-notes" *ngIf="session.notes">
                  <div class="notes-header">
                    <span class="notes-icon">📝</span>
                    <span class="notes-label">Notes:</span>
                  </div>
                  <p class="notes-content">{{ session.notes }}</p>
                </div>
              </div>

              <div class="session-actions">
                <button
                  class="btn-icon"
                  *ngIf="session.status === 'ACTIVE'"
                  (click)="stopSession(session)"
                  title="Stop Session"
                >
                  ⏸️
                </button>
                <button class="btn-icon" (click)="editSession(session)" title="Edit Session">
                  ✏️
                </button>
                <button
                  class="btn-icon delete"
                  (click)="deleteSession(session)"
                  title="Delete Session"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noSessions>
        <div class="empty-state">
          <div class="empty-icon">⏱️</div>
          <h3>No Work Sessions Found</h3>
          <p *ngIf="hasActiveFilters()">
            Try adjusting your filters or clear them to see all sessions.
          </p>
          <p *ngIf="!hasActiveFilters()">
            You haven't recorded any work sessions yet. Start tracking your work to see your history
            here.
          </p>
          <div class="empty-actions">
            <button class="btn btn-outline" (click)="clearFilters()" *ngIf="hasActiveFilters()">
              Clear Filters
            </button>
            <button class="btn btn-primary" routerLink="/work-sessions">Start Work Session</button>
          </div>
        </div>
      </ng-template>

      <!-- Loading State -->
      <div class="loading" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading work sessions...</p>
      </div>
    </div>

    <!-- Edit Session Modal (simplified) -->
    <div class="modal-overlay" *ngIf="editingSession" (click)="cancelEdit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Edit Work Session</h3>
          <button class="modal-close" (click)="cancelEdit()">×</button>
        </div>
        <textarea
          [(ngModel)]="editSessionNotes"
          name="sessionNotes"
          placeholder="Add notes about this work session..."
          class="form-input"
          rows="4"
        ></textarea>

        <div class="modal-footer">
          <button class="btn btn-outline" (click)="cancelEdit()">Cancel</button>
          <button class="btn btn-primary" (click)="saveSessionEdit()">Save Changes</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .session-history-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .history-header {
        margin-bottom: 2rem;
      }

      .header-info h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 2rem;
      }

      .header-subtitle {
        margin: 0 0 2rem 0;
        color: #666;
        font-size: 1.1rem;
      }

      .header-stats {
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

      .filters-section {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .filters-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        align-items: end;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .filter-group label {
        font-weight: 500;
        color: #333;
        font-size: 0.9rem;
      }

      .filter-input {
        padding: 0.5rem;
        border: 1px solid #e1e5e9;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .filter-input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
      }

      .filter-actions {
        display: flex;
        gap: 0.5rem;
      }

      .sessions-section {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .date-group {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .date-header {
        background: #f8f9fa;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e1e5e9;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .date-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
      }

      .date-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: #666;
      }

      .sessions-list {
        display: flex;
        flex-direction: column;
      }

      .session-card {
        padding: 1.5rem;
        border-bottom: 1px solid #f0f0f0;
        transition: background 0.3s ease;
      }

      .session-card:hover {
        background: #f8f9fa;
      }

      .session-card:last-child {
        border-bottom: none;
      }

      .session-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .session-project h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.1rem;
      }

      .session-status {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .status-active {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .status-completed {
        background: #e3f2fd;
        color: #1976d2;
      }

      .status-cancelled {
        background: #ffebee;
        color: #c62828;
      }

      .duration-value {
        font-size: 1.2rem;
        font-weight: bold;
        color: #007bff;
      }

      .session-details {
        margin-bottom: 1rem;
      }

      .session-time {
        display: flex;
        gap: 2rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }

      .time-info {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .time-label {
        color: #666;
        font-size: 0.9rem;
      }

      .time-value {
        color: #333;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .session-notes {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 6px;
        border-left: 3px solid #007bff;
      }

      .notes-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .notes-label {
        font-weight: 500;
        color: #333;
        font-size: 0.9rem;
      }

      .notes-content {
        margin: 0;
        color: #666;
        line-height: 1.5;
        font-size: 0.9rem;
      }

      .session-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }

      .btn-icon {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background 0.3s ease;
      }

      .btn-icon:hover {
        background: #e9ecef;
      }

      .btn-icon.delete:hover {
        background: #ffebee;
      }

      .btn {
        padding: 0.5rem 1rem;
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

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .empty-state p {
        color: #666;
        margin-bottom: 2rem;
        line-height: 1.6;
      }

      .empty-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
        color: #666;
        margin: 0;
      }

      /* Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }

      .modal-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        min-width: 400px;
        max-width: 500px;
        max-height: 80vh;
        overflow: hidden;
      }

      .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e1e5e9;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.2rem;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }

      .modal-close:hover {
        background: #f0f0f0;
        color: #333;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #e1e5e9;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        background: #f8f9fa;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .form-group label {
        font-weight: 500;
        color: #333;
        font-size: 0.9rem;
      }

      .form-input {
        padding: 0.75rem;
        border: 1px solid #e1e5e9;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .form-input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
      }

      @media (max-width: 768px) {
        .session-history-container {
          padding: 1rem;
        }

        .header-stats {
          grid-template-columns: 1fr;
        }

        .filters-row {
          grid-template-columns: 1fr;
        }

        .filter-actions {
          justify-content: stretch;
        }

        .filter-actions .btn {
          flex: 1;
        }

        .date-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .session-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .session-time {
          flex-direction: column;
          gap: 0.5rem;
        }

        .session-actions {
          justify-content: center;
        }

        .empty-actions {
          flex-direction: column;
        }

        .modal-content {
          min-width: auto;
          margin: 1rem;
          max-width: calc(100vw - 2rem);
        }
      }
    `,
  ],
})
export class SessionHistoryComponent implements OnInit {
  sessions: WorkSession[] = [];
  filteredSessions: WorkSession[] = [];
  groupedSessions: { date: Date; sessions: WorkSession[]; totalHours: number }[] = [];
  uniqueProjects: { id: number; title: string }[] = [];

  loading = false;
  editingSession: WorkSession | null = null;
  editSessionNotes = '';

  totalHours = 0;
  totalEarnings = 0;

  // Filter controls
  projectFilter = new FormControl('');
  statusFilter = new FormControl('');
  dateFromFilter = new FormControl('');
  dateToFilter = new FormControl('');

  readonly SessionStatus = SessionStatus;

  constructor(private workSessionService: WorkSessionService) {}

  ngOnInit(): void {
    this.loadSessions();
    this.setupFilterSubscriptions();
  }

  loadSessions(): void {
    this.loading = true;
    this.workSessionService.getUserWorkSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions.sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        this.extractUniqueProjects();
        this.calculateTotals();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.loading = false;
      },
    });
  }

  setupFilterSubscriptions(): void {
    // Subscribe to filter changes
    this.projectFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.dateFromFilter.valueChanges.subscribe(() => this.applyFilters());
    this.dateToFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  extractUniqueProjects(): void {
    const projectMap = new Map<number, string>();
    this.sessions.forEach((session) => {
      if (!projectMap.has(session.projectId)) {
        projectMap.set(session.projectId, session.projectTitle || `Project ${session.projectId}`);
      }
    });

    this.uniqueProjects = Array.from(projectMap.entries()).map(([id, title]) => ({ id, title }));
  }

  calculateTotals(): void {
    this.totalHours = this.sessions.reduce((total, session) => {
      return total + (session.hours || 0);
    }, 0);

    // Estimate earnings (this would come from project rates in a real app)
    this.totalEarnings = this.totalHours * 25; // Assuming $25/hour average
  }

  applyFilters(): void {
    let filtered = [...this.sessions];

    // Project filter
    const projectId = this.projectFilter.value;
    if (projectId) {
      filtered = filtered.filter((session) => session.projectId.toString() === projectId);
    }

    // Status filter
    const status = this.statusFilter.value;
    if (status) {
      filtered = filtered.filter((session) => session.status === status);
    }

    // Date range filter
    const dateFrom = this.dateFromFilter.value;
    const dateTo = this.dateToFilter.value;

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((session) => new Date(session.startTime) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((session) => new Date(session.startTime) <= toDate);
    }

    this.filteredSessions = filtered;
    this.groupSessionsByDate();
  }

  groupSessionsByDate(): void {
    const groups = new Map<string, WorkSession[]>();

    this.filteredSessions.forEach((session) => {
      const dateKey = new Date(session.startTime).toDateString();
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(session);
    });

    this.groupedSessions = Array.from(groups.entries())
      .map(([dateString, sessions]) => {
        const totalHours = sessions.reduce((total, session) => total + (session.hours || 0), 0);
        return {
          date: new Date(dateString),
          sessions,
          totalHours,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  clearFilters(): void {
    this.projectFilter.setValue('');
    this.statusFilter.setValue('');
    this.dateFromFilter.setValue('');
    this.dateToFilter.setValue('');
  }

  hasActiveFilters(): boolean {
    return !!(
      this.projectFilter.value ||
      this.statusFilter.value ||
      this.dateFromFilter.value ||
      this.dateToFilter.value
    );
  }

  getSessionDuration(session: WorkSession): number {
    if (session.hours !== undefined) {
      return session.hours * 60 * 60 * 1000; // Convert hours to milliseconds
    }

    if (session.endTime) {
      return new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
    }

    if (session.status === SessionStatus.ACTIVE) {
      return new Date().getTime() - new Date(session.startTime).getTime();
    }

    return 0;
  }

  stopSession(session: WorkSession): void {
    // In a real app, this would call the service to stop the session
    console.log('Stopping session:', session.id);
    // Reload sessions after stopping
    this.loadSessions();
  }

  editSession(session: WorkSession): void {
    this.editingSession = session;
    this.editSessionNotes = session.notes || '';
  }

  cancelEdit(): void {
    this.editingSession = null;
    this.editSessionNotes = '';
  }

  saveSessionEdit(): void {
    if (this.editingSession) {
      // In a real app, this would call the service to update the session
      console.log('Saving session edit:', this.editingSession.id, this.editSessionNotes);

      // Update locally for demo
      this.editingSession.notes = this.editSessionNotes;
      this.cancelEdit();
    }
  }

  deleteSession(session: WorkSession): void {
    if (confirm('Are you sure you want to delete this work session?')) {
      // In a real app, this would call the service to delete the session
      console.log('Deleting session:', session.id);

      // Remove from local array for demo
      this.sessions = this.sessions.filter((s) => s.id !== session.id);
      this.applyFilters();
      this.calculateTotals();
    }
  }

  exportSessions(): void {
    // In a real app, this would generate and download a CSV/Excel file
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `work-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(): string {
    const headers = [
      'Date',
      'Project',
      'Start Time',
      'End Time',
      'Duration (Hours)',
      'Status',
      'Notes',
    ];
    const rows = this.filteredSessions.map((session) => [
      new Date(session.startTime).toLocaleDateString(),
      session.projectTitle || `Project ${session.projectId}`,
      new Date(session.startTime).toLocaleTimeString(),
      session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'N/A',
      (session.hours || 0).toFixed(2),
      session.status,
      (session.notes || '').replace(/,/g, ';'), // Replace commas to avoid CSV issues
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }
}
