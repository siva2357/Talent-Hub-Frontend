import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostForm } from './blog-post-form';

describe('BlogPostForm', () => {
  let component: BlogPostForm;
  let fixture: ComponentFixture<BlogPostForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPostForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
