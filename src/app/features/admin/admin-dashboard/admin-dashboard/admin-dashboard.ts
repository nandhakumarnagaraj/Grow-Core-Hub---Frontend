import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div class="header-actions">
          <button class="btn btn-primary" routerLink="/admin/projects/create">
            Create Project
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💼</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.activeProjects }}</div>
            <div class="stat-label">Active Projects</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pendingApplications }}</div>
            <div class="stat-label">Pending Applications</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completedProjects }}</div>
            <div class="stat-label">Completed Projects</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <div class="action-card" routerLink="/admin/users">
            <div class="action-icon">👥</div>
            <h3>Manage Users</h3>
            <p>View and manage user accounts</p>
          </div>
          <div class="action-card" routerLink="/admin/projects">
            <div class="action-icon">💼</div>
            <h3>Manage Projects</h3>
            <p>Create and manage projects</p>
          </div>
          <div class="action-card" routerLink="/admin/applications">
            <div class="action-icon">📋</div>
            <h3>Review Applications</h3>
            <p>Review pending applications</p>
          </div>
          <div class="action-card" routerLink="/admin/analytics">
            <div class="action-icon">📊</div>
            <h3>View Analytics</h3>
            <p>Platform usage statistics</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let activity of recentActivities">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <div class="activity-description">{{ activity.description }}</div>
              <div class="activity-time">{{ activity.timestamp | date : 'short' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-dashboard-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .dashboard-header h1 {
        margin: 0;
        color: #333;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .stat-icon {
        font-size: 2.5rem;
        opacity: 0.8;
      }

      .stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 0.25rem;
      }

      .stat-label {
        color: #666;
        font-size: 0.9rem;
      }

      .quick-actions {
        margin-bottom: 3rem;
      }

      .quick-actions h2 {
        margin-bottom: 1.5rem;
        color: #333;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .action-card {
        background: white;
        padding: 2rem;
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

      .recent-activity {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .recent-activity h2 {
        margin: 0 0 1.5rem 0;
        color: #333;
      }

      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .activity-icon {
        font-size: 1.5rem;
      }

      .activity-description {
        color: #333;
        font-weight: 500;
      }

      .activity-time {
        color: #666;
        font-size: 0.8rem;
        margin-top: 0.25rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        text-decoration: none;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background: #0056b3;
      }

      @media (max-width: 768px) {
        .dashboard-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .stats-grid,
        .actions-grid {
          grid-template-columns: 1fr;
        }

        .stat-card {
          flex-direction: column;
          text-align: center;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    activeProjects: 0,
    pendingApplications: 0,
    completedProjects: 0,
  };

  recentActivities = [
    {
      icon: '👤',
      description: 'New user registration: John Doe',
      timestamp: new Date(),
    },
    {
      icon: '💼',
      description: 'New project created: Data Entry Task',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      icon: '📋',
      description: 'Application submitted for Virtual Assistant role',
      timestamp: new Date(Date.now() - 120000),
    },
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // In a real app, you'd load these from services
    this.stats = {
      totalUsers: 150,
      activeProjects: 25,
      pendingApplications: 45,
      completedProjects: 120,
    };
  }
}
