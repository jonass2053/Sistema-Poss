import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionDetalleComponent } from './recepcion-detalle.component';

describe('RecepcionDetalleComponent', () => {
  let component: RecepcionDetalleComponent;
  let fixture: ComponentFixture<RecepcionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecepcionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
