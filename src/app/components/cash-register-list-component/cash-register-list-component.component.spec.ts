import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterListComponentComponent } from './cash-register-list-component.component';

describe('CashRegisterListComponentComponent', () => {
  let component: CashRegisterListComponentComponent;
  let fixture: ComponentFixture<CashRegisterListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashRegisterListComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashRegisterListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
