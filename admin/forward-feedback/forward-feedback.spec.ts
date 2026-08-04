import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardFeedback } from './forward-feedback';

describe('ForwardFeedback', () => {
  let component: ForwardFeedback;
  let fixture: ComponentFixture<ForwardFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForwardFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwardFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
