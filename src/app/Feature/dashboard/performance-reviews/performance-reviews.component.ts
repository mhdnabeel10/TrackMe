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
        // Store the initial angles using a custom property
        const pathElement = this as SVGPathElement & { _current: d3.PieArcDatum<{ name: string; value: number }> };
        pathElement._current = d;
      })
      .transition() // Add transition for animation
      .duration(1000)
      .attrTween('d', function (d) {
        const pathElement = this as SVGPathElement & { _current: d3.PieArcDatum<{ name: string; value: number }> };
        const interpolate = d3.interpolate(pathElement._current, d);
        pathElement._current = interpolate(1); // Update _current to the final state
        return function (t) {
          return arc(interpolate(t))!;
        };
      });
  
    // Add labels
    svg
      .selectAll('text')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text((d) => `${d.data.name}: ${d.data.value}`)
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('opacity', 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);
  }
  
}
