import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportRequests } from './support-requests';

describe('SupportRequests', () => {
  let component: SupportRequests;
  let fixture: ComponentFixture<SupportRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
