import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recruiter } from './recruiter';

describe('Recruiter', () => {
  let component: Recruiter;
  let fixture: ComponentFixture<Recruiter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recruiter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recruiter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
