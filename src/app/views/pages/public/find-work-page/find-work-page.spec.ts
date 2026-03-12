import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindWorkPage } from './find-work-page';

describe('FindWorkPage', () => {
  let component: FindWorkPage;
  let fixture: ComponentFixture<FindWorkPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindWorkPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindWorkPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
