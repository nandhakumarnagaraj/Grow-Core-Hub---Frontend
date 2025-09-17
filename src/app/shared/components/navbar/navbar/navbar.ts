import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Authservice } from '../../../../core/services/authservice';
import { WorkSessionService } from '../../../../core/services/work-session-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand" routerLink="/">
          <img src="assets/images/logo.png" alt="GrowCORE" class="logo" />
          <span class="brand-text">GrowCORE</span>
        </div>

        <div class="navbar-menu" [class.active]="isMenuOpen">
          <div class="nav-links" *ngIf="isAuthenticated">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🏠</span>
              Dashboard
            </a>
            <a routerLink="/projects" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">💼</span>
              Projects
            </a>
            <a routerLink="/applications" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📋</span>
              Applications
            </a>
            <a routerLink="/work-sessions" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">⏰</span>
              Work Sessions
            </a>
            <a routerLink="/profile" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">👤</span>
              Profile
            </a>
          </div>

          <!-- Work Timer (if active session) -->
          <div class="work-timer" *ngIf="activeSession">
            <div class="timer-display">
              <span class="timer-icon">🟢</span>
              <span class="timer-text">{{ currentTimer }}</span>
            </div>
          </div>

          <div class="navbar-user" *ngIf="isAuthenticated">
            <div class="user-menu" (click)="toggleUserMenu()">
              <div class="user-avatar">{{ currentUser?.name?.charAt(0) }}</div>
              <span class="user-name">{{ currentUser?.name }}</span>
              <span class="dropdown-icon">▼</span>
            </div>
            <div class="user-dropdown" [class.show]="showUserMenu">
              <a routerLink="/profile" class="dropdown-item" (click)="closeUserMenu()">
                <span class="dropdown-icon">👤</span>
                My Profile
              </a>
              <a routerLink="/settings" class="dropdown-item" (click)="closeUserMenu()">
                <span class="dropdown-icon">⚙️</span>
                Settings
              </a>
              <hr class="dropdown-divider" />
              <button class="dropdown-item logout-btn" (click)="logout()">
                <span class="dropdown-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>

          <div class="auth-links" *ngIf="!isAuthenticated">
            <a routerLink="/auth/login" class="nav-link">Login</a>
            <a routerLink="/auth/signup" class="nav-link btn-primary">Sign Up</a>
          </div>
        </div>

        <button class="mobile-toggle" (click)="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .navbar-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        position: relative;
      }

      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
      }

      .logo {
        height: 40px;
        width: auto;
      }

      .brand-text {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
      }

      .navbar-menu {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: #666;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        transition: all 0.3s ease;
      }

      .nav-link:hover {
        color: #007bff;
        background: #f8f9fa;
      }

      .nav-link.active {
        color: #007bff;
        background: #e3f2fd;
      }

      .nav-icon {
        font-size: 1.1rem;
      }

      .work-timer {
        background: #e8f5e8;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        border: 2px solid #28a745;
      }

      .timer-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #155724;
        font-weight: 600;
      }

      .timer-icon {
        font-size: 0.8rem;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 1;
        }
      }

      .navbar-user {
        position: relative;
      }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 8px;
        transition: background 0.3s ease;
      }

      .user-menu:hover {
        background: #f8f9fa;
      }

      .user-avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      .user-name {
        color: #333;
        font-weight: 500;
      }

      .dropdown-icon {
        font-size: 0.8rem;
        color: #666;
        transition: transform 0.3s ease;
      }

      .user-menu.active .dropdown-icon {
        transform: rotate(180deg);
      }

      .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      }

      .user-dropdown.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: #333;
        text-decoration: none;
        transition: background 0.3s ease;
        border: none;
        background: none;
        width: 100%;
        cursor: pointer;
        font-size: 0.9rem;
      }

      .dropdown-item:hover {
        background: #f8f9fa;
      }

      .dropdown-divider {
        border: none;
        border-top: 1px solid #e1e5e9;
        margin: 0.5rem 0;
      }

      .logout-btn {
        color: #dc3545;
      }

      .logout-btn:hover {
        background: #f8d7da;
      }

      .auth-links {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .btn-primary {
        background: #007bff;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
      }

      .btn-primary:hover {
        background: #0056b3;
        color: white;
      }

      .mobile-toggle {
        display: none;
        flex-direction: column;
        gap: 3px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
      }

      .mobile-toggle span {
        width: 25px;
        height: 3px;
        background: #333;
        border-radius: 2px;
        transition: all 0.3s ease;
      }

      @media (max-width: 768px) {
        .mobile-toggle {
          display: flex;
        }

        .navbar-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          flex-direction: column;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .navbar-menu.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .nav-links {
          flex-direction: column;
          width: 100%;
          gap: 0;
        }

        .nav-link {
          width: 100%;
          justify-content: flex-start;
          padding: 1rem;
          border-radius: 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .work-timer {
          order: -1;
          margin-bottom: 1rem;
        }

        .navbar-user {
          order: -1;
          margin-bottom: 1rem;
        }

        .auth-links {
          flex-direction: column;
          width: 100%;
          gap: 0.5rem;
        }

        .auth-links .nav-link {
          text-align: center;
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  currentUser = this.authService.getCurrentUser();
  showUserMenu = false;
  isMenuOpen = false;
  activeSession: any = null;
  currentTimer = '00:00:00';

  constructor(
    private authService: Authservice,
    private workSessionService: WorkSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });

    this.workSessionService.activeSession$.subscribe((session) => {
      this.activeSession = session;
    });

    this.workSessionService.timer$.subscribe((timer) => {
      this.currentTimer = timer;
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  toggleMobileMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.isMenuOpen = false;
  }
}
