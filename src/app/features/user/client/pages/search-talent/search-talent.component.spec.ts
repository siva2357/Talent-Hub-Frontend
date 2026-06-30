import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchTalentComponent } from './search-talent.component';
import { ProfileService } from '../../../../../core/services/profile.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('SearchTalentComponent', () => {
  let component: SearchTalentComponent;
  let fixture: ComponentFixture<SearchTalentComponent>;

  let mockProfileService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockProfileService = {
      getFreelancers: jasmine.createSpy('getFreelancers').and.returnValue(of({ success: true, items: [] })),
      getSavedTalents: jasmine.createSpy('getSavedTalents').and.returnValue(of({ success: true, savedTalents: [] })),
      saveTalent: jasmine.createSpy('saveTalent').and.returnValue(of({ success: true })),
      unsaveTalent: jasmine.createSpy('unsaveTalent').and.returnValue(of({ success: true }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [SearchTalentComponent, FormsModule],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load talents and saved talents on init', () => {
      expect(mockProfileService.getFreelancers).toHaveBeenCalled();
      expect(mockProfileService.getSavedTalents).toHaveBeenCalled();
    });

    it('should map talent fields correctly', () => {
      const mockFreelancer = {
        _id: '1',
        fullName: 'John Doe',
        professionalHeadline: 'Developer',
        city: 'New York',
        country: 'USA',
        profilePhoto: 'photo.jpg',
        completedContracts: 5,
        hourlyRate: 100
      };

      const mapped = component.mapTalentFields(mockFreelancer);
      
      expect(mapped.id).toBe('1');
      expect(mapped.name).toBe('John Doe');
      expect(mapped.role).toBe('Developer');
      expect(mapped.location).toBe('New York, USA');
      expect(mapped.performance).toBe(50); // 5 * 10
      expect(mapped.performanceTier).toBe('Medium'); // 50 is medium
    });
  });

  describe('Filtering', () => {
    it('should apply filters and reload talents', () => {
      component.searchQuery = 'Angular';
      component.selectedCategory = 'Web Development';
      component.selectedPerformance = 'High';
      component.minRate = 20;
      component.maxRate = 100;

      component.applyFilters();

      expect(component.appliedSearchQuery).toBe('Angular');
      expect(component.appliedCategory).toBe('Web Development');
      expect(mockProfileService.getFreelancers).toHaveBeenCalledWith({
        search: 'Angular',
        category: 'Web Development',
        minRate: 20,
        maxRate: 100
      });
    });

    it('should reset filters and reload all talents', () => {
      component.searchQuery = 'Angular';
      component.resetFilters();

      expect(component.searchQuery).toBe('');
      expect(component.selectedCategory).toBe('All Categories');
      expect(component.minRate).toBeNull();
      expect(component.appliedSearchQuery).toBe('');
      
      // Should reload talents without filter params
      expect(mockProfileService.getFreelancers).toHaveBeenCalled();
    });
  });

  describe('Talent Actions', () => {
    it('should toggle save talent (save)', () => {
      component.savedTalentsSet.clear();
      component.toggleSaveTalent('123');

      expect(mockProfileService.saveTalent).toHaveBeenCalledWith('123');
      expect(component.isSaved('123')).toBeTrue();
    });

    it('should toggle save talent (unsave)', () => {
      component.savedTalentsSet.add('123');
      component.toggleSaveTalent('123');

      expect(mockProfileService.unsaveTalent).toHaveBeenCalledWith('123');
      expect(component.isSaved('123')).toBeFalse();
    });

    it('should navigate to talent profile', () => {
      component.viewProfile('123');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/talent-profile', '123']);
    });
  });
});
