import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StraddleChartComponent } from './straddle-chart.component';

describe('StraddleChartComponent', () => {
  let component: StraddleChartComponent;
  let fixture: ComponentFixture<StraddleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StraddleChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StraddleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
