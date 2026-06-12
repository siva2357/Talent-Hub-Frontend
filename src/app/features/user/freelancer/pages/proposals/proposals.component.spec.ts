import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proposals } from './proposals';

describe('Proposals', () => {
  let component: Proposals;
  let fixture: ComponentFixture<Proposals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proposals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Proposals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
