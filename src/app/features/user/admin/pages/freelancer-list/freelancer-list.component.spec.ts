import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreelancerListComponent } from './freelancer-list.component';
import { AdminService } from '../../../../../core/services/admin.service';
import { of } from 'rxjs';

describe('FreelancerListComponent', () => {
  let component: FreelancerListComponent;
  let fixture: ComponentFixture<FreelancerListComponent>;
  let mockAdminService: any;

  beforeEach(async () => {
    mockAdminService = {
      getFreelancers: jasmine.createSpy('getFreelancers').and.returnValue(of([
        { id: '1', name: 'Alice', email: 'alice@f.com', status: 'Active', skills: ['Angular'], hourlyRate: 50, completedProjects: 1 },
        { id: '2', name: 'Bob', email: 'bob@f.com', status: 'Pending Approval', skills: ['React'], hourlyRate: 40, completedProjects: 0 }
      ])),
      updateFreelancerStatus: jasmine.createSpy('updateFreelancerStatus').and.returnValue(of(null)),
      approveFreelancer: jasmine.createSpy('approveFreelancer').and.returnValue(of(null))
    };

    await TestBed.configureTestingModule({
      imports: [FreelancerListComponent],
      providers: [
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FreelancerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load freelancers on init', () => {
    expect(mockAdminService.getFreelancers).toHaveBeenCalled();
    expect(component.freelancers().length).toBe(2);
  });

  it('should filter freelancers by search term', () => {
    component.searchTerm.set('Alice');
    expect(component.filteredFreelancers().length).toBe(1);
    expect(component.filteredFreelancers()[0].name).toBe('Alice');
  });

  it('should filter freelancers by status', () => {
    component.statusFilter.set('Pending Approval');
    expect(component.filteredFreelancers().length).toBe(1);
    expect(component.filteredFreelancers()[0].name).toBe('Bob');
  });
});
