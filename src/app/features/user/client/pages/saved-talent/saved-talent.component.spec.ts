import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTalentComponent } from './saved-talent.component';

describe('SavedTalentComponent', () => {
  let component: SavedTalentComponent;
  let fixture: ComponentFixture<SavedTalentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedTalentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
