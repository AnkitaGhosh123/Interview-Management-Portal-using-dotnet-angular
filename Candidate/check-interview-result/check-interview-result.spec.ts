import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInterviewResult } from './check-interview-result';

describe('CheckInterviewResult', () => {
  let component: CheckInterviewResult;
  let fixture: ComponentFixture<CheckInterviewResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInterviewResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInterviewResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
