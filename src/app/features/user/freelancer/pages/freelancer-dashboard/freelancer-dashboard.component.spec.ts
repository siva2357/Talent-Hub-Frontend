import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FreelancerDashboardComponent } from './freelancer-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { of, throwError } from 'rxjs';

describe('FreelancerDashboardComponent', () => {
  let component: FreelancerDashboardComponent;
  let fixture: ComponentFixture<FreelancerDashboardComponent>;
  let mockDashboardService: any;

  beforeEach(async () => {
    mockDashboardService = {
      getDashboardStats: jasmine.createSpy('getDashboardStats').and.returnValue(of({
        success: true,
        fullName: 'Test Freelancer',
        profilePhoto: 'http://test.com/photo.jpg',
        activeContractsCount: 5,
        stats: [{ label: 'Earnings', value: '$500', icon: 'bi-cash', color: 'green' }],
        activities: [{ id: '1', title: 'Test Activity', description: 'desc', time: '1h ago', status: 'completed', icon: 'bi-check' }]
      }))
    };

    await TestBed.configureTestingModule({
      imports: [FreelancerDashboardComponent, RouterTestingModule],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelancerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    expect(mockDashboardService.getDashboardStats).toHaveBeenCalled();
    expect(component.freelancerName()).toBe('Test Freelancer');
    expect(component.profilePhoto()).toBe('http://test.com/photo.jpg');
    expect(component.activeContractsCount()).toBe(5);
    expect(component.stats().length).toBe(1);
    expect(component.activities().length).toBe(1);
    expect(component.isLoading()).toBeFalse();
  });

  it('should handle error when loading dashboard data fails', () => {
    mockDashboardService.getDashboardStats.and.returnValue(throwError(() => new Error('Error')));
    component.loadDashboardData();
    expect(component.isLoading()).toBeFalse();
  });

  it('should compute greeting correctly', () => {
    // Just testing it returns a string and doesn't crash since it depends on Date
    const greeting = component.greeting();
    expect(greeting).toBeTruthy();
    expect(typeof greeting).toBe('string');
  });
});
