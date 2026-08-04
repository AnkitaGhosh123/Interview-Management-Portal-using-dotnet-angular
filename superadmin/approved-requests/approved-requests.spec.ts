import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRequests } from './approved-requests';

describe('ApprovedRequests', () => {
  let component: ApprovedRequests;
  let fixture: ComponentFixture<ApprovedRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
