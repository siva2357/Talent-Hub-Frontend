import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageContract } from './manage-contract';
import { ContractService } from '../../../core/services/contract.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManageContract', () => {
  let component: ManageContract;
  let fixture: ComponentFixture<ManageContract>;
  
  let mockContractService: jasmine.SpyObj<ContractService>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;
  let mockMasterDataService: jasmine.SpyObj<MasterDataService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockContractService = jasmine.createSpyObj('ContractService', ['getMyContracts', 'deleteContract']);
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['createRazorpayOrder', 'verifyRazorpayPayment']);
    mockMasterDataService = jasmine.createSpyObj('MasterDataService', ['getAllMasterData']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Setup default mock returns
    mockMasterDataService.getAllMasterData.and.returnValue(of({
      success: true,
      data: {
        ContractCategories: [{ key: 'web', value: 'Web Dev' }],
        ContractStatus: [{ key: 'active', value: 'Active' }]
      }
    }));
    
    mockContractService.getMyContracts.and.returnValue(of({
      success: true,
      contracts: [
        { _id: '1', contractTitle: 'Test Contract 1', contractCategory: 'web', status: 'open', estimatedBudget: 100 },
        { _id: '2', contractTitle: 'Test Contract 2', contractCategory: 'design', status: 'completed', estimatedBudget: 200 }
      ] as any[]
    }));

    await TestBed.configureTestingModule({
      imports: [ManageContract],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: MasterDataService, useValue: mockMasterDataService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageContract);
    component = fixture.componentInstance;
    fixture.detectChanges(); // calls ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch master data on init', () => {
    expect(mockMasterDataService.getAllMasterData).toHaveBeenCalled();
    expect(component.categoryOptions.length).toBeGreaterThan(1);
    expect(component.statusOptions.length).toBeGreaterThan(1);
  });

  it('should fetch contracts on init', () => {
    expect(mockContractService.getMyContracts).toHaveBeenCalled();
    expect(component.allContracts.length).toBe(2);
  });

  it('should filter contracts based on search query', () => {
    component.searchQuery = 'Contract 1';
    component.applyFilters();
    expect(component.filteredContracts.length).toBe(1);
    expect(component.filteredContracts[0].contractTitle).toBe('Test Contract 1');
  });

  it('should filter contracts based on category', () => {
    component.selectedCategory = 'web';
    component.applyFilters();
    expect(component.filteredContracts.length).toBe(1);
    expect(component.filteredContracts[0].contractCategory).toBe('web');
  });

  it('should call deleteContract and update list when delete is confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockContractService.deleteContract.and.returnValue(of({ success: true, message: 'Deleted successfully' }));
    
    component.deleteContract('1');
    
    expect(mockContractService.deleteContract).toHaveBeenCalledWith('1');
    expect(component.allContracts.length).toBe(1);
    expect(component.allContracts.find(c => c._id === '1')).toBeUndefined();
  });
});
