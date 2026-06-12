import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPostComponent } from './blog-post.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { BlogService } from '../../../../../core/services/blog.service';
import { of } from 'rxjs';

describe('BlogPostComponent', () => {
  let component: BlogPostComponent;
  let fixture: ComponentFixture<BlogPostComponent>;
  let mockToastr: any;
  let mockBlogService: any;

  beforeEach(async () => {
    mockToastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      warning: jasmine.createSpy('warning')
    };

    mockBlogService = {
      getPosts: jasmine.createSpy('getPosts').and.returnValue(of([])),
      getPublishedPosts: jasmine.createSpy('getPublishedPosts').and.returnValue(of([])),
      addPost: jasmine.createSpy('addPost'),
      togglePostStatus: jasmine.createSpy('togglePostStatus'),
      deletePost: jasmine.createSpy('deletePost')
    };

    await TestBed.configureTestingModule({
      imports: [BlogPostComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr },
        { provide: BlogService, useValue: mockBlogService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
