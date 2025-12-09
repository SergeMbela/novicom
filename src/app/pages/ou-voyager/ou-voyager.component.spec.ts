import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuVoyagerComponent } from './ou-voyager.component';

describe('OuVoyagerComponent', () => {
  let component: OuVoyagerComponent;
  let fixture: ComponentFixture<OuVoyagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OuVoyagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OuVoyagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
