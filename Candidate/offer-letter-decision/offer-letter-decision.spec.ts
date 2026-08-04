import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterDecision } from './offer-letter-decision';

describe('OfferLetterDecision', () => {
  let component: OfferLetterDecision;
  let fixture: ComponentFixture<OfferLetterDecision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLetterDecision]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferLetterDecision);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
