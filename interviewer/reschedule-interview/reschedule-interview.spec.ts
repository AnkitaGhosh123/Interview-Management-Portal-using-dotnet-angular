import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleInterview } from './reschedule-interview';

describe('RescheduleInterview', () => {
  let component: RescheduleInterview;
  let fixture: ComponentFixture<RescheduleInterview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleInterview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescheduleInterview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
