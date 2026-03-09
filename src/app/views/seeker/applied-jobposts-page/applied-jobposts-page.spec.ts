import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedJobpostsPage } from './applied-jobposts-page';

describe('AppliedJobpostsPage', () => {
  let component: AppliedJobpostsPage;
  let fixture: ComponentFixture<AppliedJobpostsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedJobpostsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedJobpostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
