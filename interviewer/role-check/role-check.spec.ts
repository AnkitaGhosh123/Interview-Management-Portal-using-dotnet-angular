import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCheck } from './role-check';

describe('RoleCheck', () => {
  let component: RoleCheck;
  let fixture: ComponentFixture<RoleCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleCheck]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleCheck);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
