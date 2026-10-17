import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Modal } from './modal';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed when onConfirm is called', () => {
    spyOn(component.confirmed, 'emit');
    component.onConfirm();
    expect(component.confirmed.emit).toHaveBeenCalled();
  });

  it('should emit cancelled and closed when onCancel is called', () => {
    spyOn(component.cancelled, 'emit');
    spyOn(component.closed, 'emit');
    component.onCancel();
    expect(component.cancelled.emit).toHaveBeenCalled();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit closed when onClose is called', () => {
    spyOn(component.closed, 'emit');
    component.onClose();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
