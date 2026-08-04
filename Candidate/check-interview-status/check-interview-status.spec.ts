import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInterviewStatus } from './check-interview-status';

describe('CheckInterviewStatus', () => {
  let component: CheckInterviewStatus;
  let fixture: ComponentFixture<CheckInterviewStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInterviewStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInterviewStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
