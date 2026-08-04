import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInterviewers } from './search-interviewers';

describe('SearchInterviewers', () => {
  let component: SearchInterviewers;
  let fixture: ComponentFixture<SearchInterviewers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInterviewers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInterviewers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
