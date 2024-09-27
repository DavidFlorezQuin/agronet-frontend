import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InseminacionComponent } from './inseminacion.component';

describe('InseminacionComponent', () => {
  let component: InseminacionComponent;
  let fixture: ComponentFixture<InseminacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InseminacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InseminacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
