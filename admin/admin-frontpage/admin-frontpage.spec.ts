import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFrontpage } from './admin-frontpage';

describe('AdminFrontpage', () => {
  let component: AdminFrontpage;
  let fixture: ComponentFixture<AdminFrontpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFrontpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFrontpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
