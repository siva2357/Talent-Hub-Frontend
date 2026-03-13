import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTalents } from './saved-talents';

describe('SavedTalents', () => {
  let component: SavedTalents;
  let fixture: ComponentFixture<SavedTalents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedTalents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedTalents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
