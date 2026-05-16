import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaptureAttendanceComponent } from './capture-attendance.component';

describe('CaptureAttendanceComponent', () => {
  let component: CaptureAttendanceComponent;
  let fixture: ComponentFixture<CaptureAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureAttendanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaptureAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
