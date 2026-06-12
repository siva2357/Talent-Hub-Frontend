import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegalContractComponent } from './legal-contract.component';

describe('LegalContractComponent', () => {
  let component: LegalContractComponent;
  let fixture: ComponentFixture<LegalContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
