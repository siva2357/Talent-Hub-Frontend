import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Talents } from './talents';

describe('Talents', () => {
  let component: Talents;
  let fixture: ComponentFixture<Talents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Talents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Talents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
