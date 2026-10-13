import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogDetails } from './blog-details';
import { BlogService } from '../../../core/services/blog.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BlogDetails', () => {
  let component: BlogDetails;
  let fixture: ComponentFixture<BlogDetails>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let mockActivatedRoute: any;

  const mockBlog = {
    _id: 'b123',
    title: 'How to Hire the Best Freelancers',
    content: 'Full article content here...',
    category: 'Guides',
    author: 'Admin Team',
    createdAt: '2026-01-01'
  };

  const createComponentWithId = async (idParam: string | null) => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap(idParam ? { id: idParam } : {})
      }
    };

    blogServiceSpy = jasmine.createSpyObj('BlogService', ['getBlogByIdPublic']);
    blogServiceSpy.getBlogByIdPublic.and.returnValue(of({
      success: true,
      blog: structuredClone(mockBlog)
    }));

    await TestBed.configureTestingModule({
      imports: [BlogDetails],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BlogService, useValue: blogServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetails);
    component = fixture.componentInstance;
  };

  it('should create the component', async () => {
    await createComponentWithId('b123');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Missing Blog ID', () => {
    it('should set error message when id param is missing from route', async () => {
      await createComponentWithId(null);
      fixture.detectChanges();

      expect(component.errorMessage).toBe('Blog ID not found');
      expect(component.loading).toBeFalse();
      expect(blogServiceSpy.getBlogByIdPublic).not.toHaveBeenCalled();
    });
  });

  describe('Fetching Blog Details', () => {
    beforeEach(async () => {
      await createComponentWithId('b123');
    });

    it('should successfully fetch blog details by id', () => {
      fixture.detectChanges();

      expect(blogServiceSpy.getBlogByIdPublic).toHaveBeenCalledWith('b123');
      expect(component.loading).toBeFalse();
      expect(component.blog).toEqual(jasmine.objectContaining({
        _id: 'b123',
        title: 'How to Hire the Best Freelancers'
      }));
      expect(component.errorMessage).toBe('');
    });

    it('should handle response with success false', () => {
      blogServiceSpy.getBlogByIdPublic.and.returnValue(of({
        success: false,
        message: 'Article is not published'
      } as any));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.blog).toBeNull();
      expect(component.errorMessage).toBe('Article is not published');
    });

    it('should use default error message when success is false without custom message', () => {
      blogServiceSpy.getBlogByIdPublic.and.returnValue(of({
        success: false
      } as any));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.blog).toBeNull();
      expect(component.errorMessage).toBe('Blog not found');
    });

    it('should handle HTTP error with backend message', () => {
      blogServiceSpy.getBlogByIdPublic.and.returnValue(throwError(() => ({
        error: { message: 'Database connection failed' }
      })));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.blog).toBeNull();
      expect(component.errorMessage).toBe('Database connection failed');
    });

    it('should handle HTTP error with fallback message', () => {
      blogServiceSpy.getBlogByIdPublic.and.returnValue(throwError(() => new Error('Unknown error')));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.blog).toBeNull();
      expect(component.errorMessage).toBe('Failed to load blog');
    });
  });
});
