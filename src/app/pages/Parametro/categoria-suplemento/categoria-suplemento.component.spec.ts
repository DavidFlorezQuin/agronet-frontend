import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaSuplementoComponent } from './categoria-suplemento.component';

describe('CategoriaSuplementoComponent', () => {
  let component: CategoriaSuplementoComponent;
  let fixture: ComponentFixture<CategoriaSuplementoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriaSuplementoComponent]
    });
    fixture = TestBed.createComponent(CategoriaSuplementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
