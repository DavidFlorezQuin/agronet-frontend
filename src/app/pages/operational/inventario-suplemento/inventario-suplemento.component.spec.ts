import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioSuplementoComponent } from './inventario-suplemento.component';

describe('InventarioSuplementoComponent', () => {
  let component: InventarioSuplementoComponent;
  let fixture: ComponentFixture<InventarioSuplementoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioSuplementoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioSuplementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
