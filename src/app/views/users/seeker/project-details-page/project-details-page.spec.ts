import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsPage } from './project-details-page';

describe('ProjectDetailsPage', () => {
  let component: ProjectDetailsPage;
  let fixture: ComponentFixture<ProjectDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
