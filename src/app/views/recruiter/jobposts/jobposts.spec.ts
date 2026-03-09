import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobposts } from './jobposts';

describe('Jobposts', () => {
  let component: Jobposts;
  let fixture: ComponentFixture<Jobposts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobposts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobposts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
