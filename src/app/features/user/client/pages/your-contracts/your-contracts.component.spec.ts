import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourContractsComponent } from './your-contracts.component';

describe('YourContractsComponent', () => {
  let component: YourContractsComponent;
  let fixture: ComponentFixture<YourContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourContractsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
