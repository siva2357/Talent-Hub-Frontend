import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChabotComponent } from './ai-chabot-component';

describe('AiChabotComponent', () => {
  let component: AiChabotComponent;
  let fixture: ComponentFixture<AiChabotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiChabotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChabotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
