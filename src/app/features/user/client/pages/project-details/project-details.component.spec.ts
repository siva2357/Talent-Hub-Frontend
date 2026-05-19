import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDetailsComponent } from './project-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            params: of({ id: '1' })
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
