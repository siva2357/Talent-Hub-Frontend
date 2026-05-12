import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindWork } from './find-work';

describe('FindWork', () => {
  let component: FindWork;
  let fixture: ComponentFixture<FindWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
