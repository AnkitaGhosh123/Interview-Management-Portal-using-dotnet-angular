import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateOffer } from './generate-offer';

describe('GenerateOffer', () => {
  let component: GenerateOffer;
  let fixture: ComponentFixture<GenerateOffer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateOffer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateOffer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
