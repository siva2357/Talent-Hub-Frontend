import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchpadPage } from './launchpad-page';

describe('LaunchpadPage', () => {
  let component: LaunchpadPage;
  let fixture: ComponentFixture<LaunchpadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchpadPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchpadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
