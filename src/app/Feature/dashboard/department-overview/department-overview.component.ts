import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as d3 from 'd3';
import { EmployeeList, ReviewsData } from '../dashboard-interface';
import { DashboardService } from '../../../shared/Services/dashboard.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-overview',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './department-overview.component.html',
  styleUrls: ['./department-overview.component.css'],
})
export class DepartmentOverviewComponent implements OnInit {
  @Input() isDepComponent: boolean = true; 
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private data: ReviewsData[] = [];
  employees: EmployeeList[] = [];
  departmentPerformance: { department: string; averageScore: number }[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getEmployeData().subscribe(
      (employeeResponse) => {
        this.employees = employeeResponse;
        console.log('Employees:', this.employees);
  
        // Call after employees are fetched
        this.calculateDepartmentPerformance();
  
        // Fetch department data after employees (if needed)
        this.dashboardService.getDepartmentData().subscribe(
          (departmentResponse) => {
            this.data = departmentResponse;
            console.log('Department Data:', this.data);
  
            // Create chart after all data is fetched and processed
            this.createBarChart();
          },
          (error) => console.error('Error fetching department data:', error)
        );
      },
      (error) => console.error('Error fetching employee data:', error)
    );
  }
  

  // Calculate average performance score for each department
  calculateDepartmentPerformance(): void {
    const departmentMap: { [key: string]: { totalScore: number; count: number } } = {};

    this.employees.forEach((employee) => {
      if (!departmentMap[employee.department]) {
        departmentMap[employee.department] = { totalScore: 0, count: 0 };
      }
      departmentMap[employee.department].totalScore += employee.performance.score;
      departmentMap[employee.department].count++; 
    });

    this.departmentPerformance = Object.keys(departmentMap).map((department) => ({
      department,
      averageScore:
        departmentMap[department].count > 0
          ? departmentMap[department].totalScore / departmentMap[department].count
          : 0,
    }));
    console.log('Department Performance:', this.departmentPerformance);
  }

  createBarChart(): void {
    console.log('Data for Bar Chart:', this.departmentPerformance);
    const element = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // Append the SVG container
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Create scales
    const x = d3
      .scaleBand()
      .domain(this.departmentPerformance.map((d) => d.department))
      .range([0, width])
      .padding(0.1);
  
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.departmentPerformance, (d) => d.averageScore) as number])
      .nice()
      .range([height, 0]);
  
    // Add X Axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
  
    // Add Y Axis
    svg.append('g').call(d3.axisLeft(y));
  
    // Add Bars with Animation
    svg
      .selectAll('.bar')
      .data(this.departmentPerformance)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.department) as number)
      .attr('y', height) // Start at the bottom of the chart
      .attr('width', x.bandwidth())
      .attr('height', 0) // Start with zero height
      .attr('fill', '#69b3a2')
      .transition() // Add transition for animation
      .duration(800) // Animation duration
      .delay((_, i) => i * 100) // Delay each bar for a staggered effect
      .attr('y', (d) => y(d.averageScore)) // Final y position
      .attr('height', (d) => height - y(d.averageScore)); // Final height
  }
}
