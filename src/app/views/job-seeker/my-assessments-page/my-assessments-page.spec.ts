import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAssessmentsPage } from './my-assessments-page';

describe('MyAssessmentsPage', () => {
  let component: MyAssessmentsPage;
  let fixture: ComponentFixture<MyAssessmentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAssessmentsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAssessmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
