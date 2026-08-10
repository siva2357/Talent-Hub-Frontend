import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerError500 } from './server-error-500';

describe('ServerError500', () => {
  let component: ServerError500;
  let fixture: ComponentFixture<ServerError500>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerError500]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerError500);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
