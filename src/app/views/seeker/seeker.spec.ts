import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Seeker } from './seeker';

describe('Seeker', () => {
  let component: Seeker;
  let fixture: ComponentFixture<Seeker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seeker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Seeker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
