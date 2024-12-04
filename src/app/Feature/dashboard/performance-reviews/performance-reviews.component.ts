import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DashboardService } from '../../../shared/Services/dashboard.service';
import * as d3 from 'd3';
import { ReviewsData } from '../dashboard-interface';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-performance-reviews',
  standalone: true,
  imports: [CommonModule,EmployeeListComponent],
  templateUrl: './performance-reviews.component.html',
  styleUrl: './performance-reviews.component.css'
})
export class PerformanceReviewsComponent {
  @Input() isEmpList: boolean = true; // Control visibility of empolyelist
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private data: ReviewsData[] = [];
  constructor(private dashboardService: DashboardService) {} // Inject the service

  ngOnInit(): void {
    
    this.dashboardService.getReviewData().subscribe((response) => {
      this.data = response;
      this.createDonutChart();
    });
    
  }
  createDonutChart(): void {
    const element = this.chartContainer.nativeElement;
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;
  
    // Append the SVG container
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
    // Set up color scale
    const color = d3
      .scaleOrdinal()
      .domain(this.data.map((d) => d.name))
      .range(d3.schemeCategory10);
  
    // Create pie and arc generator
    const pie = d3.pie<{ name: string; value: number }>().value((d) => d.value);
    const arc = d3
      .arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(radius * 0.5) // Inner radius for donut shape
      .outerRadius(radius);
  
    // Append paths for the donut chart
    const path = svg
      .selectAll('path')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('fill', (d) => color(d.data.name) as string)
      .attr('d', arc)
      .each(function (d) {
        const pathElement = this as SVGPathElement & { _current: d3.PieArcDatum<{ name: string; value: number }> };
        pathElement._current = d; // Store the initial state
      });
  
    // Add tooltip for hover labels
    const tooltip = d3
      .select(element)
      .append('div')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.2)')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);
  
    // Add hover interaction
    path
      .on('mouseover', function (event, d) {
        tooltip
          .html(`<strong>${d.data.name}</strong>: ${d.data.value}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`)
          .style('opacity', 1);
        d3.select(this).style('opacity', 0.8); // Highlight the segment
      })
      .on('mousemove', function (event) {
        tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0); // Hide the tooltip
        d3.select(this).style('opacity', 1); // Reset segment opacity
      });
  }
  
  
}
