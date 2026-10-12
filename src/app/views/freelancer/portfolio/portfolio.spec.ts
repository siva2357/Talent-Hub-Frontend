import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Portfolio } from './portfolio';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Portfolio', () => {
  let component: Portfolio;
  let fixture: ComponentFixture<Portfolio>;

  let mockPortfolioService: jasmine.SpyObj<PortfolioService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPortfoliosData = [
    {
      _id: 'port-1',
      title: 'E-Commerce Angular Storefront',
      projectType: 'Web Development',
      tags: ['Angular', 'TypeScript', 'Tailwind'],
      media: { url: 'https://example.com/img1.png' }
    },
    {
      _id: 'port-2',
      title: 'Fintech Mobile App UI/UX',
      projectType: 'UI/UX Design',
      tags: ['Figma', 'Prototyping'],
      media: { url: 'https://example.com/img2.png' }
    }
  ];

  beforeEach(async () => {
    mockPortfolioService = jasmine.createSpyObj('PortfolioService', [
      'getMyPortfolios',
      'deletePortfolio'
    ]);

    mockPortfolioService.getMyPortfolios.and.returnValue(of({
      success: true,
      portfolios: structuredClone(mockPortfoliosData)
    }));

    await TestBed.configureTestingModule({
      imports: [Portfolio],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: mockPortfolioService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(mockRouter, 'navigate');

    fixture = TestBed.createComponent(Portfolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Fetching Portfolios', () => {
    it('should fetch user portfolios on init', () => {
      expect(mockPortfolioService.getMyPortfolios).toHaveBeenCalled();
      expect(component.portfolios.length).toBe(2);
      expect(component.isLoading).toBeFalse();
    });

    it('should set portfolios to empty array if response portfolios is undefined', () => {
      mockPortfolioService.getMyPortfolios.and.returnValue(of({ success: true }));
      component.fetchPortfolios();

      expect(component.portfolios).toEqual([]);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle fetch portfolios error gracefully', () => {
      spyOn(console, 'error');
      mockPortfolioService.getMyPortfolios.and.returnValue(throwError(() => new Error('Fetch failed')));

      component.fetchPortfolios();

      expect(component.isLoading).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit & Table Columns', () => {
    it('should initialize columns with correct structure', fakeAsync(() => {
      component.ngAfterViewInit();
      tick();

      expect(component.columns.length).toBe(6);
      expect(component.columns[0].field).toBe('sno');
      expect(component.columns[1].field).toBe('media');
      expect(component.columns[2].field).toBe('title');
      expect(component.columns[3].field).toBe('projectType');
      expect(component.columns[4].field).toBe('tags');
      expect(component.columns[5].field).toBe('actions');
    }));
  });

  describe('Navigation', () => {
    it('should navigate to create portfolio page', () => {
      component.navigateToAdd();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-portfolio']);
    });

    it('should navigate to edit portfolio page with ID', () => {
      component.navigateToEdit('port-1');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-portfolio', 'port-1']);
    });
  });

  describe('Delete Portfolio', () => {
    it('should delete portfolio when user confirms', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockPortfolioService.deletePortfolio.and.returnValue(of({ success: true, message: 'Deleted' }));

      component.deletePortfolio('port-1');

      expect(mockPortfolioService.deletePortfolio).toHaveBeenCalledWith('port-1');
      expect(component.portfolios.length).toBe(1);
      expect(component.portfolios.find(p => p._id === 'port-1')).toBeUndefined();
    });

    it('should not delete portfolio when user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deletePortfolio('port-1');

      expect(mockPortfolioService.deletePortfolio).not.toHaveBeenCalled();
      expect(component.portfolios.length).toBe(2);
    });

    it('should handle delete error gracefully', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(console, 'error');
      mockPortfolioService.deletePortfolio.and.returnValue(throwError(() => new Error('Delete failed')));

      component.deletePortfolio('port-1');

      expect(console.error).toHaveBeenCalled();
      expect(component.portfolios.length).toBe(2);
    });
  });

  describe('Dropdown Actions', () => {
    it('should return dropdown items for table row', () => {
      const items = component.getDropdownItems(mockPortfoliosData[0]);
      expect(items.length).toBe(2);
      expect(items[0].value).toBe('edit');
      expect(items[1].value).toBe('delete');
    });

    it('should delegate edit action to navigateToEdit', () => {
      spyOn(component, 'navigateToEdit');
      component.onDropdownAction({ label: 'Edit', value: 'edit' }, mockPortfoliosData[0]);

      expect(component.navigateToEdit).toHaveBeenCalledWith('port-1');
    });

    it('should delegate delete action to deletePortfolio', () => {
      spyOn(component, 'deletePortfolio');
      component.onDropdownAction({ label: 'Delete', value: 'delete' }, mockPortfoliosData[0]);

      expect(component.deletePortfolio).toHaveBeenCalledWith('port-1');
    });
  });
});
