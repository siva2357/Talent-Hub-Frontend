import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedContractsComponent } from './saved-contracts.component';

describe('SavedContractsComponent', () => {
  let component: SavedContractsComponent;
  let fixture: ComponentFixture<SavedContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedContractsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
