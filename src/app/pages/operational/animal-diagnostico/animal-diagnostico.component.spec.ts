import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalDiagnosticoComponent } from './animal-diagnostico.component';

describe('AnimalDiagnosticoComponent', () => {
  let component: AnimalDiagnosticoComponent;
  let fixture: ComponentFixture<AnimalDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalDiagnosticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
