import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewManagementPage } from './interview-management-page';

describe('InterviewManagementPage', () => {
  let component: InterviewManagementPage;
  let fixture: ComponentFixture<InterviewManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewManagementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
