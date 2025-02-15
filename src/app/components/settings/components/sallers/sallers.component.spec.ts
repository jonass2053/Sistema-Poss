import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SallersComponent } from './sallers.component';

describe('SallersComponent', () => {
  let component: SallersComponent;
  let fixture: ComponentFixture<SallersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SallersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SallersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
