import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingComponent } from './trading.component';

describe('TradingComponent', () => {
  let component: TradingComponent;
  let fixture: ComponentFixture<TradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
