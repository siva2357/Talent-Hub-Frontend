import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFinancialSummaryComponent } from './financial-summary.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminFinancialSummaryComponent', () => {
  let component: AdminFinancialSummaryComponent;
  let fixture: ComponentFixture<AdminFinancialSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFinancialSummaryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFinancialSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
