import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventaryAdjustmentComponent } from './inventary-adjustment.component';

describe('InventaryAdjustmentComponent', () => {
  let component: InventaryAdjustmentComponent;
  let fixture: ComponentFixture<InventaryAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventaryAdjustmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventaryAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
