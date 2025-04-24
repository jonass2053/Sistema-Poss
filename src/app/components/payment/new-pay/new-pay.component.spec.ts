import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayComponent } from './new-pay.component';

describe('NewPayComponent', () => {
  let component: NewPayComponent;
  let fixture: ComponentFixture<NewPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
