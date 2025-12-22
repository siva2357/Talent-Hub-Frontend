import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectForm } from './edit-project-form';

describe('EditProjectForm', () => {
  let component: EditProjectForm;
  let fixture: ComponentFixture<EditProjectForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProjectForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProjectForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
