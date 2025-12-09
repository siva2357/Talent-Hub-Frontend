import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingInterviewsPage } from './upcoming-interviews-page';

describe('UpcomingInterviewsPage', () => {
  let component: UpcomingInterviewsPage;
  let fixture: ComponentFixture<UpcomingInterviewsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingInterviewsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingInterviewsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
