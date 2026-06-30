import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FindContractsComponent } from './find-contracts.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('FindContractsComponent', () => {
  let component: FindContractsComponent;
  let fixture: ComponentFixture<FindContractsComponent>;
  let mockContractService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockContractService = {
      getAllContracts: jasmine.createSpy('getAllContracts').and.returnValue(of({
        contracts: [
          {
            _id: '1',
            contractTitle: 'Frontend Dev',
            contractDescription: 'Build a great frontend app',
            contractType: 'Web Development',
            hasSaved: false
          },
          {
            _id: '2',
            contractTitle: 'Backend Dev',
            contractDescription: 'Node js backend',
            contractType: 'DevOps',
            hasSaved: true
          }
        ]
      })),
      getSavedContracts: jasmine.createSpy('getSavedContracts').and.returnValue(of({
        contracts: [
          {
            _id: '2',
            contractTitle: 'Backend Dev',
            contractDescription: 'Node js backend',
            contractType: 'DevOps',
            hasSaved: true
          }
        ]
      })),
      saveContract: jasmine.createSpy('saveContract').and.returnValue(of({})),
      unsaveContract: jasmine.createSpy('unsaveContract').and.returnValue(of({}))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [FindContractsComponent],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FindContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should load all contracts and saved contracts on init', fakeAsync(() => {
      expect(mockContractService.getAllContracts).toHaveBeenCalled();
      expect(mockContractService.getSavedContracts).toHaveBeenCalled();
      
      expect(component.contracts().length).toBe(2);
      expect(component.savedContracts().length).toBe(1);
      expect(component.isLoading()).toBeFalse();
    }));

    it('should default to the discover tab', () => {
      expect(component.activeTab()).toBe('discover');
    });
  });

  describe('Filtering functionality', () => {
    it('should compute filteredContracts based on search query', fakeAsync(() => {
      expect(component.filteredContracts().length).toBe(2);
      
      component.searchQuery.set('frontend');
      fixture.detectChanges();
      
      expect(component.filteredContracts().length).toBe(1);
      expect(component.filteredContracts()[0].contractTitle).toBe('Frontend Dev');
    }));

    it('should compute filteredContracts based on selected category', fakeAsync(() => {
      expect(component.filteredContracts().length).toBe(2);
      
      component.selectedCategory.set('DevOps');
      fixture.detectChanges();
      
      expect(component.filteredContracts().length).toBe(1);
      expect(component.filteredContracts()[0].contractTitle).toBe('Backend Dev');
    }));

    it('should apply filters from draft state to actual state', () => {
      component.draftSearchQuery.set('backend');
      component.draftCategory.set('DevOps');
      
      component.applyFilters();
      
      expect(component.searchQuery()).toBe('backend');
      expect(component.selectedCategory()).toBe('DevOps');
    });

    it('should reset all filters correctly', () => {
      component.draftSearchQuery.set('backend');
      component.draftCategory.set('DevOps');
      component.searchQuery.set('backend');
      component.selectedCategory.set('DevOps');

      component.resetFilters();
      
      expect(component.draftSearchQuery()).toBe('');
      expect(component.draftCategory()).toBe('All Categories');
      expect(component.searchQuery()).toBe('');
      expect(component.selectedCategory()).toBe('All Categories');
    });

    it('should remove category filter via chip', () => {
      component.draftCategory.set('Web Development');
      component.selectedCategory.set('Web Development');

      component.removeCategoryFilter();
      
      expect(component.draftCategory()).toBe('All Categories');
      expect(component.selectedCategory()).toBe('All Categories');
    });
  });

  describe('Saving and Unsaving Contracts', () => {
    it('should save a contract, update contracts list, and reload saved contracts', fakeAsync(() => {
      component.saveContract('1');
      
      expect(mockContractService.saveContract).toHaveBeenCalledWith('1');
      expect(component.contracts()[0].hasSaved).toBeTrue();
      // Should reload saved contracts
      expect(mockContractService.getSavedContracts).toHaveBeenCalledTimes(2); 
    }));

    it('should unsave a contract, update contracts list, and immediately remove from saved contracts signal', fakeAsync(() => {
      component.saveContract('2');
      
      expect(mockContractService.unsaveContract).toHaveBeenCalledWith('2');
      expect(component.contracts()[1].hasSaved).toBeFalse();
      expect(component.savedContracts().length).toBe(0); // Should be instantly filtered out
    }));
  });

  describe('Navigation', () => {
    it('should navigate to contract details', () => {
      component.viewContract('1');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/contract-details'], { queryParams: { id: '1' } });
    });

    it('should switch tabs correctly', () => {
      component.activeTab.set('saved');
      expect(component.activeTab()).toBe('saved');
      
      component.activeTab.set('discover');
      expect(component.activeTab()).toBe('discover');
    });
  });
});
