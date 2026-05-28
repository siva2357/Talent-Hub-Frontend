import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioComponent } from './portfolio.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../../../core/services/portfolio.service';
import { of } from 'rxjs';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let mockToastr: any;
  let mockPortfolioService: any;

  beforeEach(async () => {
    mockToastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      warning: jasmine.createSpy('warning')
    };

    mockPortfolioService = {
      getPortfolioItems: jasmine.createSpy('getPortfolioItems').and.returnValue(of([])),
      addPortfolioItem: jasmine.createSpy('addPortfolioItem'),
      deletePortfolioItem: jasmine.createSpy('deletePortfolioItem'),
      updatePortfolioItem: jasmine.createSpy('updatePortfolioItem')
    };

    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr },
        { provide: PortfolioService, useValue: mockPortfolioService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
