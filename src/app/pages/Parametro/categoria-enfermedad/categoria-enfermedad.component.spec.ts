import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEnfermedadComponent } from './categoria-enfermedad.component';

describe('CategoriaEnfermedadComponent', () => {
  let component: CategoriaEnfermedadComponent;
  let fixture: ComponentFixture<CategoriaEnfermedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaEnfermedadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaEnfermedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
