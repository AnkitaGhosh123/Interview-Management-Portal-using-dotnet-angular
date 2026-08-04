import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateResume } from './candidate-resume';

describe('CandidateResume', () => {
  let component: CandidateResume;
  let fixture: ComponentFixture<CandidateResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateResume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateResume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
