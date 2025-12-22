import { TestBed } from '@angular/core/testing';

import { SeekerProfileService } from './seeker-profile-service';

describe('SeekerProfileService', () => {
  let service: SeekerProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeekerProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
