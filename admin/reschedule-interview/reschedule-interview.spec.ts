import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleInterviewComponent } from './reschedule-interview';

describe('RescheduleInterview', () => {
  let component: RescheduleInterviewComponent;
  let fixture: ComponentFixture<RescheduleInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleInterviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescheduleInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
