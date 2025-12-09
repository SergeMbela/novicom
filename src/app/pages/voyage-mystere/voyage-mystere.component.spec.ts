import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyageMystereComponent } from './voyage-mystere.component';

describe('VoyageMystereComponent', () => {
  let component: VoyageMystereComponent;
  let fixture: ComponentFixture<VoyageMystereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyageMystereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoyageMystereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
