import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymenSalesComponent } from './paymen-sales.component';

describe('PaymenSalesComponent', () => {
  let component: PaymenSalesComponent;
  let fixture: ComponentFixture<PaymenSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymenSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymenSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
