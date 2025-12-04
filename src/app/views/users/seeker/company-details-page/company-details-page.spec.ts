import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailsPage } from './company-details-page';

describe('CompanyDetailsPage', () => {
  let component: CompanyDetailsPage;
  let fixture: ComponentFixture<CompanyDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
