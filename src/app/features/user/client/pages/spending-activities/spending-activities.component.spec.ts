import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingActivitiesComponent } from './spending-activities.component';

describe('SpendingActivitiesComponent', () => {
  let component: SpendingActivitiesComponent;
  let fixture: ComponentFixture<SpendingActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
