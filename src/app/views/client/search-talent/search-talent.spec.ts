import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchTalent } from './search-talent';
import { ProfileService } from '../../../core/services/profile.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SearchTalent', () => {
  let component: SearchTalent;
  let fixture: ComponentFixture<SearchTalent>;
  
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockMasterDataService: jasmine.SpyObj<MasterDataService>;
  let router: Router;

  beforeEach(async () => {
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getAllFreelancers']);
    mockMasterDataService = jasmine.createSpyObj('MasterDataService', ['getAllMasterData']);

    mockMasterDataService.getAllMasterData.and.returnValue(of({
      success: true,
      data: {
        Skills: [{ key: 'angular', value: 'Angular' }],
        ExperienceLevel: [{ key: 'expert', value: 'Expert' }],
        Availability: [{ key: 'full-time', value: 'Full-time' }]
      }
    }));

    mockProfileService.getAllFreelancers.and.returnValue(of({
      success: true,
      items: [
        { _id: '1', skills: ['angular'], experienceLevel: 'expert', availability: ['full-time'], professionalHeadline: 'Dev' },
        { _id: '2', skills: ['react'], experienceLevel: 'beginner', availability: ['part-time'], professionalHeadline: 'Dev' }
      ]
    }));

    await TestBed.configureTestingModule({
      imports: [SearchTalent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: mockProfileService },
        { provide: MasterDataService, useValue: mockMasterDataService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTalent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load master data and freelancers on init', () => {
    expect(mockMasterDataService.getAllMasterData).toHaveBeenCalled();
    expect(mockProfileService.getAllFreelancers).toHaveBeenCalled();
    expect(component.rawFreelancers.length).toBe(2);
    expect(component.skillOptions.length).toBe(2);
  });



  it('should apply manual filters correctly', fakeAsync(() => {
    component.selectedSkill = 'angular';
    component.applyManualFilters();
    tick();
    expect(component.freelancers.length).toBe(1);
    expect(component.freelancers[0]._id).toBe('1');

    component.selectedSkill = 'all';
    component.selectedExperience = 'expert';
    component.applyManualFilters();
    tick();
    expect(component.freelancers.length).toBe(1);
    
    component.resetManualFilters();
    tick();
    expect(component.freelancers.length).toBe(2);
  }));

  it('should remove manual filter correctly', fakeAsync(() => {
    component.selectedSkill = 'angular';
    component.applyManualFilters();
    tick();
    expect(component.activeManualFilters.length).toBe(1);
    
    component.removeManualFilter({ label: 'Skill: angular', type: 'skill', value: 'angular' });
    tick();
    expect(component.selectedSkill).toBe('all');
    expect(component.freelancers.length).toBe(2);
  }));



  it('should navigate to profile on viewProfile', () => {
    component.viewProfile('1');
    expect(router.navigate).toHaveBeenCalledWith(['/profile'], { queryParams: { id: '1' } });
  });

  it('should toggle talent save state', () => {
    const talent = { isSaved: false };
    component.onTalentSave(talent);
    expect(talent.isSaved).toBeTrue();
  });
});
