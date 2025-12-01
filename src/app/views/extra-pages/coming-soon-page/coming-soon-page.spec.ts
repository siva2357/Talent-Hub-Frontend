import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingSoonPage } from './coming-soon-page';

describe('ComingSoonPage', () => {
  let component: ComingSoonPage;
  let fixture: ComponentFixture<ComingSoonPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComingSoonPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComingSoonPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
