import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedRequests } from './rejected-requests';

describe('RejectedRequests', () => {
  let component: RejectedRequests;
  let fixture: ComponentFixture<RejectedRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
