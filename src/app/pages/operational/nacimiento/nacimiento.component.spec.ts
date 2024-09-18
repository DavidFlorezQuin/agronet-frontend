import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NacimientoComponent } from './nacimiento.component';

describe('NacimientoComponent', () => {
  let component: NacimientoComponent;
  let fixture: ComponentFixture<NacimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NacimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NacimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
