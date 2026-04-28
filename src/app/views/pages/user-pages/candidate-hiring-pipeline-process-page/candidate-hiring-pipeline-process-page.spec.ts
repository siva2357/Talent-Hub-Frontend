import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateHiringPipelineProcessPage } from './candidate-hiring-pipeline-process-page';

describe('CandidateHiringPipelineProcessPage', () => {
  let component: CandidateHiringPipelineProcessPage;
  let fixture: ComponentFixture<CandidateHiringPipelineProcessPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateHiringPipelineProcessPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateHiringPipelineProcessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
