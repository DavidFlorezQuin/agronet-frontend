import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FincaUsuarioComponent } from './finca-usuario.component';

describe('FincaUsuarioComponent', () => {
  let component: FincaUsuarioComponent;
  let fixture: ComponentFixture<FincaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FincaUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FincaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
