import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionesGeneralesComponent } from './configuraciones-generales.component';

describe('ConfiguracionesGeneralesComponent', () => {
  let component: ConfiguracionesGeneralesComponent;
  let fixture: ComponentFixture<ConfiguracionesGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionesGeneralesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionesGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
