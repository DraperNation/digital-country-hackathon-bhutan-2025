import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsChainComponent } from './options-chain.component';

describe('OptionsChainComponent', () => {
  let component: OptionsChainComponent;
  let fixture: ComponentFixture<OptionsChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsChainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
