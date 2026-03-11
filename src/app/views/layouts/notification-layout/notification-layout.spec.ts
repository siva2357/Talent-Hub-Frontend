import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationLayout } from './notification-layout';

describe('NotificationLayout', () => {
  let component: NotificationLayout;
  let fixture: ComponentFixture<NotificationLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
