import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAvatar } from './profile-avatar';

describe('ProfileAvatar', () => {
  let component: ProfileAvatar;
  let fixture: ComponentFixture<ProfileAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAvatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAvatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
