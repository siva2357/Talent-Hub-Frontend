import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockInterviewSessionPage } from './mock-interview-session-page';

describe('MockInterviewSessionPage', () => {
  let component: MockInterviewSessionPage;
  let fixture: ComponentFixture<MockInterviewSessionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockInterviewSessionPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockInterviewSessionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
