import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NotificationsComponent } from './notifications.component';
import { NotificationService } from '../../../core/services/notification.service';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let mockNotificationService: any;

  beforeEach(async () => {
    mockNotificationService = {
      getUserNotifications: () => of({ notifications: [] }),
      markAsRead: (id: string) => of({ message: 'Success' }),
      markAllAsRead: () => of({ message: 'Success' }),
      deleteNotification: (id: string) => of({ message: 'Success' }),
      clearNotifications: () => of({ message: 'Success' })
    };

    await TestBed.configureTestingModule({
      imports: [NotificationsComponent, HttpClientTestingModule],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
