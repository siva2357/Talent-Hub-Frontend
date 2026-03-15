import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedJobposts } from './saved-jobposts';

describe('SavedJobposts', () => {
  let component: SavedJobposts;
  let fixture: ComponentFixture<SavedJobposts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedJobposts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedJobposts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
