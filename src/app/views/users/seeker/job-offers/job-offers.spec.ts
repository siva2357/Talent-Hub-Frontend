import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOffers } from './job-offers';

describe('JobOffers', () => {
  let component: JobOffers;
  let fixture: ComponentFixture<JobOffers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOffers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOffers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
