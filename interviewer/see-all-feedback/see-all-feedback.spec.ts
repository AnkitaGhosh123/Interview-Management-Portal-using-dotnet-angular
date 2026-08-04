import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllFeedback } from './see-all-feedback';

describe('SeeAllFeedback', () => {
  let component: SeeAllFeedback;
  let fixture: ComponentFixture<SeeAllFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeAllFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeAllFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
