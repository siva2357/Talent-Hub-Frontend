import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentPage } from './recruitment-page';

describe('RecruitmentPage', () => {
  let component: RecruitmentPage;
  let fixture: ComponentFixture<RecruitmentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
