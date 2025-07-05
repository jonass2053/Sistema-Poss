import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingInventaryComponent } from './setting-inventary.component';

describe('SettingInventaryComponent', () => {
  let component: SettingInventaryComponent;
  let fixture: ComponentFixture<SettingInventaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingInventaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingInventaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
