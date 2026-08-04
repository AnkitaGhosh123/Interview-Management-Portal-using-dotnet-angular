import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRejected } from './offer-rejected';

describe('OfferRejected', () => {
  let component: OfferRejected;
  let fixture: ComponentFixture<OfferRejected>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferRejected]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferRejected);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
