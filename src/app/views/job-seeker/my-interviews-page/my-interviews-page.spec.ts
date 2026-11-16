import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInterviewsPage } from './my-interviews-page';

describe('MyInterviewsPage', () => {
  let component: MyInterviewsPage;
  let fixture: ComponentFixture<MyInterviewsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyInterviewsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInterviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
