import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminService } from '../../../../../core/services/admin.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockAdminService: any;

  beforeEach(async () => {
    mockAdminService = {
      getDashboardStats: jasmine.createSpy('getDashboardStats').and.returnValue(of({
        totalClients: 10,
        totalFreelancers: 20,
        activeContracts: 5,
        totalCommissions: 1000
      })),
      getRecentActivities: jasmine.createSpy('getRecentActivities').and.returnValue(of([
        { id: 1, action: 'User registered' }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard stats on init', () => {
    expect(mockAdminService.getDashboardStats).toHaveBeenCalled();
    expect(component.stats().totalClients).toBe(10);
    expect(component.stats().totalFreelancers).toBe(20);
  });

  it('should load recent activities on init and set isLoading to false', () => {
    expect(mockAdminService.getRecentActivities).toHaveBeenCalled();
    expect(component.recentActivities().length).toBe(1);
    expect(component.isLoading()).toBeFalse();
  });
});
