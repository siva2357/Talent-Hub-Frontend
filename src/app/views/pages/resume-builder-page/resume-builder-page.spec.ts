import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeBuilderPage } from './resume-builder-page';

describe('ResumeBuilderPage', () => {
  let component: ResumeBuilderPage;
  let fixture: ComponentFixture<ResumeBuilderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeBuilderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeBuilderPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
