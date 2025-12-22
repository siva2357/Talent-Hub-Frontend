import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePage } from './maintenance-page';

describe('MaintenancePage', () => {
  let component: MaintenancePage;
  let fixture: ComponentFixture<MaintenancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenancePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenancePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
