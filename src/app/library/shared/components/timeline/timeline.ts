import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  TitleCasePipe
} from '@angular/common';

import {
  TimelineMode,
  TimelineStatus,
  TimelineStep
} from '../../../../core/models/ui.model';

export type {
  TimelineMode,
  TimelineStatus,
  TimelineStep
};

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css'
})
export class Timeline {

  @Input()
  mode: TimelineMode = 'default';

  @Input()
  steps: TimelineStep[] = [];

  @Input()
  showStatusLabel = false;

  @Output()
  stepClicked = new EventEmitter<number>();


  /* =====================================================
     MODE
  ===================================================== */

  get modeClass(): string {

    switch (this.mode) {

      case 'with-icon':
        return 'with-icon';

      case 'minimal':
        return 'minimal';

      case 'numbered':
        return 'numbered';

      default:
        return '';

    }
  }


  /* =====================================================
     STATUS HELPERS
  ===================================================== */

  isCompleted(step: TimelineStep): boolean {
    return step.status === 'completed';
  }

  isActive(step: TimelineStep): boolean {
    return step.status === 'active';
  }

  isUpcoming(step: TimelineStep): boolean {
    return step.status === 'upcoming';
  }


  /* =====================================================
     CLICK BEHAVIOR
  ===================================================== */

  isStepClickable(step: TimelineStep): boolean {

    return (
      step.status === 'completed' ||
      step.status === 'active'
    );

  }


  onStepClick(index: number): void {

    const step = this.steps[index];

    if (!step) {
      return;
    }

    if (!this.isStepClickable(step)) {
      return;
    }

    this.stepClicked.emit(index);

  }


  /* =====================================================
     LINE STATES
  ===================================================== */

  isLeftLineCompleted(index: number): boolean {

    if (index === 0) {
      return false;
    }

    const currentStep = this.steps[index];

    if (!currentStep) {
      return false;
    }

    return (
      currentStep.status === 'completed' ||
      currentStep.status === 'active'
    );

  }


  isRightLineCompleted(index: number): boolean {

    const currentStep = this.steps[index];

    if (!currentStep) {
      return false;
    }

    return currentStep.status === 'completed';

  }


  /* =====================================================
     ICON
  ===================================================== */

  getStepIcon(step: TimelineStep): string {

    if (step.status === 'completed') {
      return 'bi bi-check-circle-fill';
    }

    return step.icon || 'bi bi-circle';

  }

}