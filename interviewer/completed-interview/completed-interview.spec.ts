import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedInterview } from './completed-interview';

describe('CompletedInterview', () => {
  let component: CompletedInterview;
  let fixture: ComponentFixture<CompletedInterview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedInterview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedInterview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
