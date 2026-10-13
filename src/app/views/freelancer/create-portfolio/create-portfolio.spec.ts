import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreatePortfolio } from './create-portfolio';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ActivatedRoute, provideRouter, Router, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreatePortfolio', () => {
  let component: CreatePortfolio;
  let fixture: ComponentFixture<CreatePortfolio>;

  let mockPortfolioService: jasmine.SpyObj<PortfolioService>;
  let mockRouter: jasmine.SpyObj<Router>;

  let paramMapSubject: BehaviorSubject<any>;

  const mockPortfolioDetails = {
    _id: 'port-123',
    title: 'Enterprise Fintech Dashboard',
    projectType: 'Web Development',
    role: 'Lead Angular Architect',
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: '2025-06-01T00:00:00.000Z',
    description: 'Developed scalable micro-frontends with Angular and RxJS',
    projectUrl: 'https://fintech.example.com',
    tags: ['Angular', 'TypeScript', 'Tailwind'],
    media: [
      { url: 'https://example.com/screenshot1.png', mediaType: 'image' }
    ]
  };

  beforeEach(async () => {
    mockPortfolioService = jasmine.createSpyObj('PortfolioService', [
      'createPortfolio',
      'updatePortfolio',
      'getPortfolioById'
    ]);

    mockPortfolioService.createPortfolio.and.returnValue(of({
      success: true,
      data: mockPortfolioDetails
    }));

    mockPortfolioService.updatePortfolio.and.returnValue(of({
      success: true,
      data: mockPortfolioDetails
    }));

    mockPortfolioService.getPortfolioById.and.returnValue(of({
      success: true,
      data: structuredClone(mockPortfolioDetails)
    }));

    paramMapSubject = new BehaviorSubject(convertToParamMap({}));

    await TestBed.configureTestingModule({
      imports: [CreatePortfolio],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PortfolioService, useValue: mockPortfolioService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable()
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(mockRouter, 'navigate');

    fixture = TestBed.createComponent(CreatePortfolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBeFalse();
    expect(component.portfolioId).toBeNull();
  });

  describe('Form Initialization & Validations', () => {
    it('should initialize empty portfolio form with required fields', () => {
      expect(component.portfolioForm).toBeDefined();
      expect(component.portfolioForm.valid).toBeFalse();

      const title = component.portfolioForm.get('title');
      expect(title?.valid).toBeFalse();
      expect(title?.errors?.['required']).toBeTrue();
    });

    it('should validate valid form inputs', () => {
      component.portfolioForm.patchValue({
        title: 'Project Title',
        projectType: 'Web Development',
        role: 'Full Stack Engineer',
        description: 'Comprehensive project description',
        tags: 'Angular, Node.js'
      });

      expect(component.portfolioForm.valid).toBeTrue();
    });

    it('should invalidate form when start date is after end date', () => {
      component.portfolioForm.patchValue({
        title: 'Project Title',
        projectType: 'Web Development',
        role: 'Engineer',
        description: 'Project description',
        tags: 'Angular',
        startDate: '2026-06-01',
        endDate: '2026-01-01'
      });

      expect(component.portfolioForm.errors?.['dateRangeInvalid']).toBeTrue();
      expect(component.portfolioForm.valid).toBeFalse();
    });

    it('should detect invalid controls and return appropriate error messages', () => {
      const titleControl = component.portfolioForm.get('title');
      titleControl?.markAsTouched();

      expect(component.isInvalid('title')).toBeTrue();
      expect(component.getErrorMessage('title')).toBe('Project title is required');
      expect(component.getErrorMessage('projectType')).toBe('Project category is required');
      expect(component.getErrorMessage('role')).toBe('Your role or contribution is required');
      expect(component.getErrorMessage('description')).toBe('Project description is required');
      expect(component.getErrorMessage('tags')).toBe('Technologies used is required');
    });

    it('should detect date range invalidity when date inputs are touched', () => {
      component.portfolioForm.patchValue({
        startDate: '2026-06-01',
        endDate: '2026-01-01'
      });
      component.portfolioForm.get('startDate')?.markAsTouched();

      expect(component.isDateRangeInvalid()).toBeTrue();
    });
  });

  describe('Edit Mode & Loading Data', () => {
    it('should load existing portfolio details in edit mode', () => {
      paramMapSubject.next(convertToParamMap({ id: 'port-123' }));
      component.ngOnInit();

      expect(component.isEditMode).toBeTrue();
      expect(component.portfolioId).toBe('port-123');
      expect(mockPortfolioService.getPortfolioById).toHaveBeenCalledWith('port-123');

      expect(component.portfolioForm.get('title')?.value).toBe('Enterprise Fintech Dashboard');
      expect(component.portfolioForm.get('projectType')?.value).toBe('Web Development');
      expect(component.portfolioForm.get('tags')?.value).toBe('Angular, TypeScript, Tailwind');
      expect(component.previews).toEqual(['https://example.com/screenshot1.png']);
    });

    it('should handle loadPortfolioData error gracefully', () => {
      spyOn(console, 'error');
      mockPortfolioService.getPortfolioById.and.returnValue(throwError(() => new Error('Not found')));

      component.loadPortfolioData('port-invalid');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('File Uploads & Previews', () => {
    it('should update preview on successful upload', () => {
      component.onUploadComplete('https://cdn.example.com/new-image.png');
      expect(component.previews).toEqual(['https://cdn.example.com/new-image.png']);
    });

    it('should alert on upload error', () => {
      spyOn(window, 'alert');
      component.onUploadError('File size too large');
      expect(window.alert).toHaveBeenCalledWith('Upload failed: File size too large');
    });

    it('should clear previews on file removal', () => {
      component.previews = ['https://cdn.example.com/image.png'];
      component.removeFile(0);
      expect(component.previews).toEqual([]);
    });
  });

  describe('Form Submission (onSubmit)', () => {
    it('should prevent submission and mark all controls as touched when form is invalid', async () => {
      spyOn(component.portfolioForm, 'markAllAsTouched');
      await component.onSubmit();

      expect(component.portfolioForm.markAllAsTouched).toHaveBeenCalled();
      expect(mockPortfolioService.createPortfolio).not.toHaveBeenCalled();
      expect(mockPortfolioService.updatePortfolio).not.toHaveBeenCalled();
    });

    it('should create portfolio in create mode and navigate to portfolio list', async () => {
      component.portfolioForm.patchValue({
        title: 'New Creative Portfolio',
        projectType: 'UI/UX Design',
        role: 'Lead Designer',
        description: 'Comprehensive mobile and web prototypes',
        projectUrl: 'https://figma.com/file/123',
        tags: 'Figma, Sketch, Wireframing'
      });
      component.previews = ['https://cdn.example.com/prototype.mp4'];

      await component.onSubmit();

      expect(mockPortfolioService.createPortfolio).toHaveBeenCalledWith({
        title: 'New Creative Portfolio',
        projectType: 'UI/UX Design',
        role: 'Lead Designer',
        startDate: undefined,
        endDate: undefined,
        description: 'Comprehensive mobile and web prototypes',
        projectUrl: 'https://figma.com/file/123',
        tags: ['Figma', 'Sketch', 'Wireframing'],
        media: [
          { mediaType: 'video', url: 'https://cdn.example.com/prototype.mp4' }
        ]
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/portfolio']);
      expect(component.isSubmitting).toBeFalse();
    });

    it('should update portfolio in edit mode and navigate to portfolio list', async () => {
      component.isEditMode = true;
      component.portfolioId = 'port-123';

      component.portfolioForm.patchValue({
        title: 'Enterprise Fintech Dashboard Updated',
        projectType: 'Web Development',
        role: 'Lead Architect',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
        description: 'Updated micro-frontend architecture',
        projectUrl: 'https://fintech.example.com',
        tags: 'Angular, RxJS, NgRx'
      });
      component.previews = ['https://cdn.example.com/screen.png'];

      await component.onSubmit();

      expect(mockPortfolioService.updatePortfolio).toHaveBeenCalledWith('port-123', {
        title: 'Enterprise Fintech Dashboard Updated',
        projectType: 'Web Development',
        role: 'Lead Architect',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-01'),
        description: 'Updated micro-frontend architecture',
        projectUrl: 'https://fintech.example.com',
        tags: ['Angular', 'RxJS', 'NgRx'],
        media: [
          { mediaType: 'image', url: 'https://cdn.example.com/screen.png' }
        ]
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/portfolio']);
      expect(component.isSubmitting).toBeFalse();
    });

    it('should handle submission failure gracefully and show alert', async () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');

      component.portfolioForm.patchValue({
        title: 'Project Title',
        projectType: 'Web Development',
        role: 'Engineer',
        description: 'Project description',
        tags: 'Angular'
      });

      mockPortfolioService.createPortfolio.and.returnValue(throwError(() => new Error('Creation error')));

      await component.onSubmit();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Failed to create portfolio. Please try again.');
      expect(component.isSubmitting).toBeFalse();
    });
  });
});
