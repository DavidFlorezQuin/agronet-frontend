import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientoMedecinasComponent } from './tratamiento-medecinas.component';

describe('TratamientoMedecinasComponent', () => {
  let component: TratamientoMedecinasComponent;
  let fixture: ComponentFixture<TratamientoMedecinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratamientoMedecinasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TratamientoMedecinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
