import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeMaking } from './resume-making';

describe('ResumeMaking', () => {
  let component: ResumeMaking;
  let fixture: ComponentFixture<ResumeMaking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeMaking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeMaking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
