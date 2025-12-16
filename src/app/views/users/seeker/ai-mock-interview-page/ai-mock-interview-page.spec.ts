import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMockInterviewPage } from './ai-mock-interview-page';

describe('AiMockInterviewPage', () => {
  let component: AiMockInterviewPage;
  let fixture: ComponentFixture<AiMockInterviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMockInterviewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiMockInterviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
