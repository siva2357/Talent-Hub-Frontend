import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeTopicPage } from './practice-topic-page';

describe('PracticeTopicPage', () => {
  let component: PracticeTopicPage;
  let fixture: ComponentFixture<PracticeTopicPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeTopicPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeTopicPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
