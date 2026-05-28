import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreelancerListComponent } from './freelancer-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FreelancerListComponent', () => {
  let component: FreelancerListComponent;
  let fixture: ComponentFixture<FreelancerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FreelancerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
