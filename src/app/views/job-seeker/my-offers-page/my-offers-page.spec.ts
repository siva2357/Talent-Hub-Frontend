import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOffersPage } from './my-offers-page';

describe('MyOffersPage', () => {
  let component: MyOffersPage;
  let fixture: ComponentFixture<MyOffersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOffersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOffersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
