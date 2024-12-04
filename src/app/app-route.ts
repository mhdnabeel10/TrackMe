import { Routes } from '@angular/router';
import { LoginPageComponent } from './Core/login-page/login-page.component';;
import { AuthGuard } from './Core/Auth-Guards/auth.guard';
import { LayoutComponent } from './Feature/layout/layout.component';

// Define routes
export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginPageComponent  }, // Login page
  {
    path: '', 
    component: LayoutComponent , canActivate: [AuthGuard] , // Layout wrapper for all routes except login
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./Feature/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'employee-list',
        loadComponent: () => import('./Feature/dashboard/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
      },
      {
        path: 'performance-reviews',
        loadComponent: () => import('./Feature/dashboard/performance-reviews/performance-reviews.component').then(m => m.PerformanceReviewsComponent),
      },
      {
        path: 'department-overview',
        loadComponent: () => import('./Feature/dashboard/department-overview/department-overview.component').then(m => m.DepartmentOverviewComponent),
      },
    ]
  }
];
