import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateBlog } from './create-blog';
import { BlogService } from '../../../core/services/blog.service';
import { FileService } from '../../../core/services/file.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RichTextEditor } from '../../../library/shared/components/rich-text-editor/rich-text-editor';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockRichTextEditor),
      multi: true
    }
  ]
})
class MockRichTextEditor implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() height: string = '';
  @Input() validation: string = 'none';
  @Input() errorMessage: string = '';

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

describe('CreateBlog', () => {
  let component: CreateBlog;
  let fixture: ComponentFixture<CreateBlog>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;
  let masterDataServiceSpy: jasmine.SpyObj<MasterDataService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let router: Router;

  const mockCategories = [
    { key: 'tech', value: 'Technology' },
    { key: 'career', value: 'Career Advice' }
  ];

  beforeEach(async () => {
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['createBlog', 'getBlogByIdAdmin', 'updateBlog']);
    fileServiceSpy = jasmine.createSpyObj('FileService', ['deleteFile']);
    masterDataServiceSpy = jasmine.createSpyObj('MasterDataService', ['getMasterDataByCategory']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    blogServiceSpy.createBlog.and.returnValue(of({ success: true }));
    blogServiceSpy.getBlogByIdAdmin.and.returnValue(of({ success: true, blog: null }));
    blogServiceSpy.updateBlog.and.returnValue(of({ success: true }));
    masterDataServiceSpy.getMasterDataByCategory.and.returnValue(of({ success: true, data: structuredClone(mockCategories) }));

    await TestBed.configureTestingModule({
      imports: [CreateBlog, ReactiveFormsModule],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: FileService, useValue: fileServiceSpy },
        { provide: MasterDataService, useValue: masterDataServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.overrideComponent(CreateBlog, {
      remove: { imports: [RichTextEditor] },
      add: { imports: [MockRichTextEditor] }
    });

    await TestBed.compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture = TestBed.createComponent(CreateBlog);
    component = fixture.componentInstance;
  });

  it('should initialize the form and load categories', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component).toBeTruthy();
    expect(component.blogForm).toBeDefined();
    expect(component.blogForm.valid).toBeFalse();
    expect(component.categoryOptions.length).toBe(3);
  }));

  it('should handle media upload and clearing', () => {
    component.onUploadComplete('http://test.com/feat.jpg', 'featured');
    expect(component.featuredMediaUrl).toBe('http://test.com/feat.jpg');

    component.onUploadComplete('http://test.com/banner.jpg', 'banner');
    expect(component.blogBannerUrl).toBe('http://test.com/banner.jpg');

    component.clearFile('featured');
    expect(component.featuredMediaUrl).toBeNull();

    component.clearFile('banner');
    expect(component.blogBannerUrl).toBeNull();
  });

  it('should not submit if form is invalid', fakeAsync(async () => {
    fixture.detectChanges();
    tick();

    await component.onSubmit(false);
    expect(blogServiceSpy.createBlog).not.toHaveBeenCalled();
    expect(component.blogForm.touched).toBeTrue();
  }));

  it('should submit valid form and navigate on success', fakeAsync(async () => {
    fixture.detectChanges();
    tick();

    component.blogForm.patchValue({
      title: 'Top 10 Tips for Freelancers',
      content: 'Here are the tips...',
      category: 'career',
      tags: 'freelance, tips, career',
      status: 'Published'
    });

    component.onUploadComplete('http://test.com/feat.jpg', 'featured');
    component.onUploadComplete('http://test.com/banner.jpg', 'banner');

    await component.onSubmit(false);
    tick();

    expect(blogServiceSpy.createBlog).toHaveBeenCalledWith({
      title: 'Top 10 Tips for Freelancers',
      content: 'Here are the tips...',
      category: 'career',
      tags: ['freelance', 'tips', 'career'],
      status: 'Published',
      featuredMedia: 'http://test.com/feat.jpg',
      blogBanner: 'http://test.com/banner.jpg'
    });
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Blog created successfully!', 'success');
    expect(router.navigate).toHaveBeenCalledWith(['/blog-manager']);
  }));

  it('should save as draft when requested', fakeAsync(async () => {
    fixture.detectChanges();
    tick();

    component.blogForm.patchValue({
      title: 'Draft Post',
      content: 'Draft content...',
      category: 'tech',
      tags: 'draft, tech'
    });

    await component.onSubmit(true);
    tick();

    expect(component.blogForm.value.status).toBe('Draft');
    expect(blogServiceSpy.createBlog).toHaveBeenCalled();
  }));

  it('should validate tags requirement and video file detection', () => {
    fixture.detectChanges();

    const tagsControl = component.blogForm.get('tags');
    tagsControl?.setValue('');
    expect(tagsControl?.valid).toBeFalse();

    tagsControl?.setValue('   , , ');
    expect(tagsControl?.valid).toBeFalse();

    tagsControl?.setValue('Angular, TypeScript');
    expect(tagsControl?.valid).toBeTrue();

    tagsControl?.markAsTouched();
    expect(component.getValidationState('tags')).toBe('none');

    tagsControl?.setValue('');
    expect(component.getValidationState('tags')).toBe('error');
    expect(component.getErrorMessage('tags')).toBe('At least one tag is required (e.g., UI, Tech, Remote)');

    expect(component.isVideoFile('https://example.com/video.mp4')).toBeTrue();
    expect(component.isVideoFile('https://example.com/image.png')).toBeFalse();
    expect(component.isVideoFile(null)).toBeFalse();
  });

  it('should handle error when submission fails', fakeAsync(async () => {
    fixture.detectChanges();
    tick();

    blogServiceSpy.createBlog.and.returnValue(throwError(() => new Error('Server error')));

    component.blogForm.patchValue({
      title: 'Post with Error',
      content: 'Content...',
      category: 'tech',
      tags: 'error, debug'
    });

    await component.onSubmit(false);
    tick();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('Failed to create blog. Please try again.', 'error');
    expect(component.isSubmitting).toBeFalse();
  }));
});
