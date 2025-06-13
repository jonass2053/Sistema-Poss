import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBarCodeComponent } from './get-bar-code.component';

describe('GetBarCodeComponent', () => {
  let component: GetBarCodeComponent;
  let fixture: ComponentFixture<GetBarCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetBarCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetBarCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
