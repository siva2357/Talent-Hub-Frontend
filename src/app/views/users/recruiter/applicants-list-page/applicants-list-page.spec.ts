import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsListPage } from './applicants-list-page';

describe('ApplicantsListPage', () => {
  let component: ApplicantsListPage;
  let fixture: ComponentFixture<ApplicantsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantsListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantsListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
