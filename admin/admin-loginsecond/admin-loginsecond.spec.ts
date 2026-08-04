import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginsecond } from './admin-loginsecond';

describe('AdminLoginsecond', () => {
  let component: AdminLoginsecond;
  let fixture: ComponentFixture<AdminLoginsecond>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginsecond]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginsecond);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
