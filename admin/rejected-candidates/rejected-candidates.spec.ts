import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedCandidates } from './rejected-candidates';

describe('RejectedCandidates', () => {
  let component: RejectedCandidates;
  let fixture: ComponentFixture<RejectedCandidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedCandidates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedCandidates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
