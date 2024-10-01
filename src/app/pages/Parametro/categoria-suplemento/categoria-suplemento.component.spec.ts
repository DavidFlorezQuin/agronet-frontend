import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaSuplementoComponent } from './categoria-suplemento.component';

describe('CategoriaSuplementoComponent', () => {
  let component: CategoriaSuplementoComponent;
  let fixture: ComponentFixture<CategoriaSuplementoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaSuplementoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaSuplementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
