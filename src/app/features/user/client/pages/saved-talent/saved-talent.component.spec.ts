import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedTalentComponent } from './saved-talent.component';
import { ProfileService } from '../../../../../core/services/profile.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('SavedTalentComponent', () => {
  let component: SavedTalentComponent;
  let fixture: ComponentFixture<SavedTalentComponent>;
  let mockProfileService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockProfileService = {
      getSavedTalents: jasmine.createSpy('getSavedTalents').and.returnValue(of({ success: true, savedTalents: [{_id: '1', basicInformation: { fullName: 'Test' }}] })),
      unsaveTalent: jasmine.createSpy('unsaveTalent').and.returnValue(of({ success: true }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [SavedTalentComponent],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load saved talents on init', () => {
    expect(mockProfileService.getSavedTalents).toHaveBeenCalled();
    expect(component.savedTalents().length).toBe(1);
    expect(component.savedTalents()[0].id).toBe('1');
  });

  it('should unsave talent', () => {
    const event = jasmine.createSpyObj('Event', ['stopPropagation']);
    component.unsaveTalent('1', event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(mockProfileService.unsaveTalent).toHaveBeenCalledWith('1');
    expect(component.savedTalents().length).toBe(0);
  });

  it('should navigate to view profile', () => {
    component.viewProfile('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/talent-profile', '1']);
  });
});
