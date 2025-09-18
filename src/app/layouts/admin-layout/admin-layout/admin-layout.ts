import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Authservice } from '../../../core/services/authservice';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="admin-layout">
      <!-- Admin Header -->
      <header class="admin-header">
        <div class="admin-header-content">
          <div class="admin-brand">
            <img src="assets/images/logo.png" alt="GrowCORE" class="admin-logo" />
            <h1>GrowCORE Admin</h1>
          </div>
          <div class="admin-user-menu">
            <div class="user-info">
              <span class="user-name">{{ currentUser?.name }}</span>
              <span class="user-role">Administrator</span>
            </div>
            <button class="logout-btn" (click)="logout()">
              <span class="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div class="admin-body">
        <!-- Admin Sidebar -->
        <aside class="admin-sidebar">
          <nav class="admin-nav">
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📊</span>
              <span class="nav-text">Dashboard</span>
            </a>
            <a routerLink="/admin/projects" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">💼</span>
              <span class="nav-text">Projects</span>
            </a>
            <a routerLink="/admin/applications" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📋</span>
              <span class="nav-text">Applications</span>
            </a>
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span>
              <span class="nav-text">Users</span>
            </a>
            <a routerLink="/admin/assessments" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📝</span>
              <span class="nav-text">Assessments</span>
            </a>
            <a routerLink="/admin/analytics" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📈</span>
              <span class="nav-text">Analytics</span>
            </a>
          </nav>
        </aside>

        <!-- Admin Main Content -->
        <main class="admin-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: #f4f6f8;
      }

      .admin-header {
        background: #2c3e50;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .admin-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .admin-brand {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .admin-logo {
        height: 40px;
        width: auto;
      }

      .admin-brand h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .admin-user-menu {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .user-name {
        font-weight: 600;
      }

      .user-role {
        font-size: 0.8rem;
        opacity: 0.8;
      }

      .logout-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .logout-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .admin-body {
        display: flex;
        flex: 1;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
      }

      .admin-sidebar {
        width: 250px;
        background: white;
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
        padding: 2rem 0;
      }

      .admin-nav {
        display: flex;
        flex-direction: column;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 2rem;
        color: #5a6c7d;
        text-decoration: none;
        transition: all 0.3s ease;
        border-left: 3px solid transparent;
      }

      .nav-item:hover {
        background: #f8f9fa;
        color: #2c3e50;
      }

      .nav-item.active {
        background: #e3f2fd;
        color: #1976d2;
        border-left-color: #1976d2;
      }

      .nav-icon {
        font-size: 1.2rem;
        width: 20px;
        text-align: center;
      }

      .nav-text {
        font-weight: 500;
      }

      .admin-main {
        flex: 1;
        padding: 2rem;
        background: #f4f6f8;
      }

      @media (max-width: 1024px) {
        .admin-sidebar {
          width: 200px;
        }

        .nav-item {
          padding: 0.75rem 1rem;
        }

        .admin-main {
          padding: 1rem;
        }
      }

      @media (max-width: 768px) {
        .admin-body {
          flex-direction: column;
        }

        .admin-sidebar {
          width: 100%;
          padding: 1rem 0;
        }

        .admin-nav {
          flex-direction: row;
          overflow-x: auto;
          padding: 0 1rem;
        }

        .nav-item {
          flex-shrink: 0;
          padding: 0.75rem 1rem;
          border-left: none;
          border-bottom: 3px solid transparent;
          white-space: nowrap;
        }

        .nav-item.active {
          border-left: none;
          border-bottom-color: #1976d2;
        }

        .admin-header-content {
          padding: 1rem;
        }

        .admin-brand h1 {
          font-size: 1.2rem;
        }

        .user-info {
          display: none;
        }
      }
    `,
  ],
})
export class AdminLayoutComponent implements OnInit {
  currentUser: any;

  constructor(private authService: Authservice) {}

  ngOnInit(): void {
    // Initialize currentUser
    this.currentUser = this.authService.getCurrentUser();

    // Subscribe to changes
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
