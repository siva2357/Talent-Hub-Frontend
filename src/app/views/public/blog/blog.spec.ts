import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPage } from './blog';
import { BlogService } from '../../../core/services/blog.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Blog } from '../../../core/models/blog.model';

describe('BlogPage', () => {
  let component: BlogPage;
  let fixture: ComponentFixture<BlogPage>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let router: Router;

  const mockBlogs: Partial<Blog>[] = [
    {
      _id: '1',
      title: 'First Post',
      category: 'Technology',
      content: '<p>Content one</p>',
      tags: ['tech', 'ai'],
      createdAt: '2026-01-01'
    },
    {
      _id: '2',
      title: 'Second Post',
      category: 'Design',
      content: '<p>Content two</p>',
      tags: ['ui', 'ux'],
      createdAt: '2026-01-02'
    },
    {
      _id: '3',
      title: 'Third Post',
      category: 'Technology',
      content: '<p>Content three</p>',
      tags: [],
      createdAt: '2026-01-03'
    }
  ];

  beforeEach(async () => {
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['getAllPublishedBlogs']);
    blogServiceSpy.getAllPublishedBlogs.and.returnValue(of({
      success: true,
      blogs: structuredClone(mockBlogs) as Blog[]
    }));

    await TestBed.configureTestingModule({
      imports: [BlogPage],
      providers: [
        provideRouter([]),
        { provide: BlogService, useValue: blogServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(BlogPage);
    component = fixture.componentInstance;
  });

  it('should create the BlogPage component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization and Loading Blogs', () => {
    it('should load blogs and extract unique categories on init', () => {
      fixture.detectChanges();

      expect(blogServiceSpy.getAllPublishedBlogs).toHaveBeenCalled();
      expect(component.blogs.length).toBe(3);
      expect(component.filteredBlogs.length).toBe(3);
      expect(component.categories).toEqual(['Technology', 'Design']);
      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('');
    });

    it('should handle response with success false', () => {
      blogServiceSpy.getAllPublishedBlogs.and.returnValue(of({
        success: false,
        message: 'Could not retrieve published blogs'
      } as any));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Could not retrieve published blogs');
      expect(component.blogs).toEqual([]);
      expect(component.filteredBlogs).toEqual([]);
    });

    it('should use default message when response.success is false without message', () => {
      blogServiceSpy.getAllPublishedBlogs.and.returnValue(of({
        success: false
      } as any));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Unable to load blogs');
    });

    it('should handle HTTP error with backend message', () => {
      blogServiceSpy.getAllPublishedBlogs.and.returnValue(throwError(() => ({
        error: { message: 'Server currently down' }
      })));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Server currently down');
      expect(component.blogs).toEqual([]);
      expect(component.filteredBlogs).toEqual([]);
    });

    it('should handle HTTP error with fallback message', () => {
      blogServiceSpy.getAllPublishedBlogs.and.returnValue(throwError(() => new Error('Network error')));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Failed to load blogs');
    });
  });

  describe('Filtering Blogs', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset to all blogs when filtering by "All"', () => {
      component.filterByCategory('Technology');
      expect(component.filteredBlogs.length).toBe(2);

      component.filterByCategory('All');
      expect(component.selectedCategory).toBe('All');
      expect(component.filteredBlogs.length).toBe(3);
    });

    it('should filter blogs by specified category case-insensitively', () => {
      component.filterByCategory('design');
      expect(component.selectedCategory).toBe('design');
      expect(component.filteredBlogs.length).toBe(1);
      expect(component.filteredBlogs[0].title).toBe('Second Post');
    });

    it('should result in empty array when category has no matches', () => {
      component.filterByCategory('Finance');
      expect(component.selectedCategory).toBe('Finance');
      expect(component.filteredBlogs.length).toBe(0);
    });
  });

  describe('Navigation & TrackBy', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to /blog-details with id when viewBlogDetails is called', () => {
      component.viewBlogDetails('12345');
      expect(router.navigate).toHaveBeenCalledWith(['/blog-details', '12345']);
    });

    it('should not navigate if id is empty or falsy', () => {
      component.viewBlogDetails('');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should return blog._id in trackByBlogId when present', () => {
      const blog = { _id: 'blog-id-99' } as Blog;
      expect(component.trackByBlogId(0, blog)).toBe('blog-id-99');
    });

    it('should return index string in trackByBlogId when _id is missing', () => {
      const blog = {} as Blog;
      expect(component.trackByBlogId(4, blog)).toBe('4');
    });
  });
});
