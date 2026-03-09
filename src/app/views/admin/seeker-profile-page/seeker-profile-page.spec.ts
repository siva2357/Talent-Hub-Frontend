import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerProfilePage } from './seeker-profile-page';

describe('SeekerProfilePage', () => {
  let component: SeekerProfilePage;
  let fixture: ComponentFixture<SeekerProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeekerProfilePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeekerProfilePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
