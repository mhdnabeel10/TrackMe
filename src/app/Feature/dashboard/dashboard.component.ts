import { Component} from '@angular/core';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { PerformanceReviewsComponent } from './performance-reviews/performance-reviews.component';
import { DepartmentOverviewComponent } from './department-overview/department-overview.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [EmployeeListComponent,PerformanceReviewsComponent,DepartmentOverviewComponent,SidebarComponent,NavbarComponent,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent  {
  isDashboard = false
  isEmpComponent = false


  
}

