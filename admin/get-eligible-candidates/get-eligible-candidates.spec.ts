import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEligibleCandidates } from './get-eligible-candidates';

describe('GetEligibleCandidates', () => {
  let component: GetEligibleCandidates;
  let fixture: ComponentFixture<GetEligibleCandidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetEligibleCandidates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetEligibleCandidates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
