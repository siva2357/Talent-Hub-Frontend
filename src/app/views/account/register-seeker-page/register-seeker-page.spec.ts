import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSeekerPage } from './register-seeker-page';

describe('RegisterSeekerPage', () => {
  let component: RegisterSeekerPage;
  let fixture: ComponentFixture<RegisterSeekerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSeekerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSeekerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
