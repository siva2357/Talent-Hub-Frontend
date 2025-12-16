import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJobposts } from './my-jobposts';

describe('MyJobposts', () => {
  let component: MyJobposts;
  let fixture: ComponentFixture<MyJobposts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyJobposts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyJobposts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
