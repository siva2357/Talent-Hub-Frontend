import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Admin } from './admin';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the admin shell component', () => {
    expect(component).toBeTruthy();
  });
});
