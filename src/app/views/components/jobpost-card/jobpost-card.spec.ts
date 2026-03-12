import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobpostCard } from './jobpost-card';

describe('JobpostCard', () => {
  let component: JobpostCard;
  let fixture: ComponentFixture<JobpostCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobpostCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobpostCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
