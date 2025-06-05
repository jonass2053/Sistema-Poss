import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPrinterComponent } from './select-printer.component';

describe('SelectPrinterComponent', () => {
  let component: SelectPrinterComponent;
  let fixture: ComponentFixture<SelectPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPrinterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
