import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCandidates } from './assigned-candidates';

describe('AssignedCandidates', () => {
  let component: AssignedCandidates;
  let fixture: ComponentFixture<AssignedCandidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedCandidates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedCandidates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
