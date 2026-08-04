import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginfirst } from './admin-loginfirst';

describe('AdminLoginfirst', () => {
  let component: AdminLoginfirst;
  let fixture: ComponentFixture<AdminLoginfirst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginfirst]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginfirst);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
