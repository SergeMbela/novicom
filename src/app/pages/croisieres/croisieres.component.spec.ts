import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CroisieresComponent } from './croisieres.component';

describe('CroisieresComponent', () => {
  let component: CroisieresComponent;
  let fixture: ComponentFixture<CroisieresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CroisieresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CroisieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
