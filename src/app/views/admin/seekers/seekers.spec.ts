import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Seekers } from './seekers';

describe('Seekers', () => {
  let component: Seekers;
  let fixture: ComponentFixture<Seekers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seekers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Seekers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
