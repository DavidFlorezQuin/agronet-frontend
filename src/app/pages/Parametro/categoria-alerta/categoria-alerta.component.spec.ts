import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaAlertaComponent } from './categoria-alerta.component';

describe('CategoriaAlertaComponent', () => {
  let component: CategoriaAlertaComponent;
  let fixture: ComponentFixture<CategoriaAlertaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriaAlertaComponent]
    });
    fixture = TestBed.createComponent(CategoriaAlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
