import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerResetPassword } from './interviewer-reset-password';

describe('InterviewerResetPassword', () => {
  let component: InterviewerResetPassword;
  let fixture: ComponentFixture<InterviewerResetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewerResetPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
