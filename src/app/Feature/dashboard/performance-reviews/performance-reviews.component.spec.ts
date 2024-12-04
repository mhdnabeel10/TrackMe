import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceReviewsComponent } from './performance-reviews.component';

describe('PerformanceReviewsComponent', () => {
  let component: PerformanceReviewsComponent;
  let fixture: ComponentFixture<PerformanceReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
