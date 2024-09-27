import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaMedicinaComponent } from './categoria-medicina.component';

describe('CategoriaMedicinaComponent', () => {
  let component: CategoriaMedicinaComponent;
  let fixture: ComponentFixture<CategoriaMedicinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriaMedicinaComponent]
    });
    fixture = TestBed.createComponent(CategoriaMedicinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
