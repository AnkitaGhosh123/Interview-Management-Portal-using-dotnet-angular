import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignInterviewer } from './assign-interviewer';

describe('AssignInterviewer', () => {
  let component: AssignInterviewer;
  let fixture: ComponentFixture<AssignInterviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignInterviewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignInterviewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
