import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BlogManager } from './blog-manager';
import { BlogService } from '../../../core/services/blog.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ModalService } from '../../../core/services/ui/modal.service';
import { ToastService } from '../../../core/services/ui/toast.service';

describe('BlogManager', () => {
  let component: BlogManager;
  let fixture: ComponentFixture<BlogManager>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let masterDataServiceSpy: jasmine.SpyObj<MasterDataService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let router: Router;

  const mockBlogs = [
    { _id: 'b1', title: 'Getting Started with Angular', content: 'Angular guide', category: 'Tech', createdAt: '2026-01-01' },
    { _id: 'b2', title: 'Design Thinking Essentials', content: 'UX principles', category: 'Design', createdAt: '2026-01-02' }
  ];

  const mockCategories = [
    { key: 'Tech', value: 'Technology' },
    { key: 'Design', value: 'Design' }
  ];

  beforeEach(async () => {
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['getAllBlogsAdmin', 'deleteBlog']);
    masterDataServiceSpy = jasmine.createSpyObj('MasterDataService', ['getMasterDataByCategory']);
    modalServiceSpy = jasmine.createSpyObj('ModalService', ['confirm']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    blogServiceSpy.getAllBlogsAdmin.and.returnValue(of({ success: true, blogs: structuredClone(mockBlogs) }));
    blogServiceSpy.deleteBlog.and.returnValue(of({ success: true }));
    masterDataServiceSpy.getMasterDataByCategory.and.returnValue(of({ success: true, data: structuredClone(mockCategories) }));

    await TestBed.configureTestingModule({
      imports: [BlogManager],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: MasterDataService, useValue: masterDataServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        DatePipe,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BlogManager);
    component = fixture.componentInstance;
  });

  it('should initialize and load blogs and category options', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component).toBeTruthy();
    expect(blogServiceSpy.getAllBlogsAdmin).toHaveBeenCalled();
    expect(masterDataServiceSpy.getMasterDataByCategory).toHaveBeenCalledWith('BlogCategories');
    expect(component.categoryOptions.length).toBe(3);
    expect(component.columns.length).toBe(6);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle fetch blogs error gracefully', fakeAsync(() => {
    blogServiceSpy.getAllBlogsAdmin.and.returnValue(throwError(() => new Error('Error')));
    component.fetchBlogs();
    tick();

    expect(component.isLoading).toBeFalse();
  }));

  it('should filter blogs by search query and category', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    let emittedBlogs: any[] = [];
    component.paginatedBlogs$.subscribe(res => (emittedBlogs = res));
    tick(300);

    expect(emittedBlogs.length).toBe(2);

    component.onSearchChange('Angular');
    component.applyFilters();
    tick(300);
    expect(emittedBlogs.length).toBe(1);
    expect(emittedBlogs[0].title).toBe('Getting Started with Angular');

    component.onCategoryChange('Design');
    component.onSearchChange('');
    component.applyFilters();
    tick(300);
    expect(emittedBlogs.length).toBe(1);
    expect(emittedBlogs[0].category).toBe('Design');

    component.resetFilters();
    tick(300);
    expect(emittedBlogs.length).toBe(2);
  }));

  it('should remove filter criteria properly', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    component.onSearchChange('Angular');
    component.onCategoryChange('Tech');
    component.applyFilters();
    tick(300);

    expect(component.activeFilters.length).toBe(2);

    component.removeFilter({ key: 'search' });
    tick(300);
    expect(component.localSearchQuery).toBe('');

    component.removeFilter({ key: 'category' });
    tick(300);
    expect(component.localSelectedCategory).toBe('All Categories');
  }));

  it('should handle pagination changes', () => {
    component.onPageChange(2);
    expect(component.currentPage$.value).toBe(2);

    component.onPageSizeChange(25);
    expect(component.pageSize$.value).toBe(25);
    expect(component.currentPage$.value).toBe(1);
  });

  it('should delete blog when confirmed', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    modalServiceSpy.confirm.and.returnValue(Promise.resolve(true));
    component.deleteBlog('b1');
    tick();

    expect(modalServiceSpy.confirm).toHaveBeenCalled();
    expect(blogServiceSpy.deleteBlog).toHaveBeenCalledWith('b1');
    expect(component.rawBlogs$.value.length).toBe(1);
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Blog deleted successfully', 'success');
  }));

  it('should not delete blog if user cancels confirm dialog', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    modalServiceSpy.confirm.and.returnValue(Promise.resolve(false));
    component.deleteBlog('b1');
    tick();

    expect(modalServiceSpy.confirm).toHaveBeenCalled();
    expect(blogServiceSpy.deleteBlog).not.toHaveBeenCalled();
  }));

  it('should navigate on edit action and delete on delete action', () => {
    const blog = { _id: 'b1' };
    const items = component.getActionItems(blog);
    expect(items.length).toBe(2);

    spyOn(router, 'navigate');
    component.onActionSelected({ label: 'Edit', value: 'edit' }, blog);
    expect(router.navigate).toHaveBeenCalledWith(['/edit-blog', 'b1']);

    spyOn(component, 'deleteBlog');
    component.onActionSelected({ label: 'Delete', value: 'delete' }, blog);
    expect(component.deleteBlog).toHaveBeenCalledWith('b1');
  });
});
