import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentComponent } from './departament.component';

describe('DepartamentComponent', () => {
  let component: DepartamentComponent;
  let fixture: ComponentFixture<DepartamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartamentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
