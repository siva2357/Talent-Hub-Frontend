import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostDetails } from './blog-post-details';

describe('BlogPostDetails', () => {
  let component: BlogPostDetails;
  let fixture: ComponentFixture<BlogPostDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPostDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
