import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HectareValidateComponent } from './hectare-validate.component';

describe('HectareValidateComponent', () => {
  let component: HectareValidateComponent;
  let fixture: ComponentFixture<HectareValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HectareValidateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HectareValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
