import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioHistoriaComponent } from './inventario-historia.component';

describe('InventarioHistoriaComponent', () => {
  let component: InventarioHistoriaComponent;
  let fixture: ComponentFixture<InventarioHistoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventarioHistoriaComponent]
    });
    fixture = TestBed.createComponent(InventarioHistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
