import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user-role';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout/auth-layout';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout/admin-layout';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/auth/signup/signup').then(m => m.SignupComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/projects/project-list/project-list/project-list').then(m => m.ProjectListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/projects/project-detail/project-detail/project-detail').then(m => m.ProjectDetailComponent)
          }
        ]
      },
      {
        path: 'applications',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/applications/application-list/application-list/application-list').then(m => m.ApplicationListComponent)
          }
        ]
      },
      {
        path: 'assessments/:id',
        loadComponent: () => import('./features/assessments/assessment-take/assessment-take/assessment-take').then(m => m.AssessmentTakeComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'work-sessions',
        loadComponent: () => import('./features/work-sessions/work-tracker/work-tracker/work-tracker').then(m => m.WorkTrackerComponent)
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.ADMIN },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management/user-management').then(m => m.UserManagementComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }