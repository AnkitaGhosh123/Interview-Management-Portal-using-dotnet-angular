import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerRequests } from './interviewer-requests';

describe('InterviewerRequests', () => {
  let component: InterviewerRequests;
  let fixture: ComponentFixture<InterviewerRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewerRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
