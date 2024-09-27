import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaDeVidaComponent } from './historia-de-vida.component';

describe('HistoriaDeVidaComponent', () => {
  let component: HistoriaDeVidaComponent;
  let fixture: ComponentFixture<HistoriaDeVidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaDeVidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaDeVidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
