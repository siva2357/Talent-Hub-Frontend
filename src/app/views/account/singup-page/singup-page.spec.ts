import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingupPage } from './singup-page';

describe('SingupPage', () => {
  let component: SingupPage;
  let fixture: ComponentFixture<SingupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingupPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingupPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
