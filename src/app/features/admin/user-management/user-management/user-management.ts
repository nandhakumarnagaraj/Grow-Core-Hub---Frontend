import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
    <div class="user-management-container">
      <div class="management-header">
        <h1>User Management</h1>
        <div class="header-filters">
          <select [(ngModel)]="selectedRole" (change)="filterUsers()" class="filter-select">
            <option value="">All Roles</option>
            <option value="FREELANCER">Freelancers</option>
            <option value="CLIENT">Clients</option>
            <option value="ADMIN">Administrators</option>
          </select>
          <select [(ngModel)]="selectedStatus" (change)="filterUsers()" class="filter-select">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PENDING_EMAIL_VERIFICATION">Pending Verification</option>
          </select>
        </div>
      </div>

      <div class="users-table">
        <table class="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>
                <div class="user-info">
                  <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                  <span class="user-name">{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class]="'status-' + user.status.toLowerCase()">
                  {{ formatStatus(user.status) }}
                </span>
              </td>
              <td>{{ user.createdAt | date : 'short' }}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-sm btn-outline" (click)="viewUser(user)">View</button>
                  <button
                    class="btn btn-sm"
                    [class]="user.status === 'ACTIVE' ? 'btn-warning' : 'btn-success'"
                    (click)="toggleUserStatus(user)"
                  >
                    {{ user.status === 'ACTIVE' ? 'Suspend' : 'Activate' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .user-management-container {
        padding: 2rem;
      }

      .management-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .header-filters {
        display: flex;
        gap: 1rem;
      }

      .filter-select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .table {
        width: 100%;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .table th,
      .table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e1e5e9;
      }

      .table th {
        background: #f8f9fa;
        font-weight: 600;
        color: #333;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
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

      .role-badge,
      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .role-freelancer {
        background: #e3f2fd;
        color: #1976d2;
      }

      .role-client {
        background: #f3e5f5;
        color: #7b1fa2;
      }

      .role-admin {
        background: #ffebee;
        color: #c62828;
      }

      .status-active {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .status-suspended {
        background: #ffebee;
        color: #c62828;
      }

      .status-pending-email-verification {
        background: #fff3e0;
        color: #f57c00;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .btn-sm {
        padding: 0.25rem 0.75rem;
      }

      .btn-outline {
        background: transparent;
        border: 1px solid #007bff;
        color: #007bff;
      }

      .btn-warning {
        background: #ffc107;
        color: #212529;
      }

      .btn-success {
        background: #28a745;
        color: white;
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRole = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Mock data - in real app, load from service
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'FREELANCER' as any,
        status: 'ACTIVE' as any,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'CLIENT' as any,
        status: 'ACTIVE' as any,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
      },
    ];
    this.filteredUsers = [...this.users];
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      const roleMatch = !this.selectedRole || user.role === this.selectedRole;
      const statusMatch = !this.selectedStatus || user.status === this.selectedStatus;
      return roleMatch && statusMatch;
    });
  }

  viewUser(user: User): void {
    // Implement user detail view
    console.log('View user:', user);
  }

  toggleUserStatus(user: User): void {
    // Implement status toggle
    console.log('Toggle status for user:', user);
  }

  formatStatus(status: string): string {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
