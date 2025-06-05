import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTicketInvoiceComponent } from './report-ticket-invoice.component';

describe('ReportTicketInvoiceComponent', () => {
  let component: ReportTicketInvoiceComponent;
  let fixture: ComponentFixture<ReportTicketInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTicketInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportTicketInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
