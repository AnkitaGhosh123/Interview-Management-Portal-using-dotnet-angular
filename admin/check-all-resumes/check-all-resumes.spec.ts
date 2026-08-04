import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAllResumes } from './check-all-resumes';

describe('CheckAllResumes', () => {
  let component: CheckAllResumes;
  let fixture: ComponentFixture<CheckAllResumes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckAllResumes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckAllResumes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
