import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { TalentCardData } from '../../../../core/models/talent.model';


import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-talent-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './talent-card.html',
  styleUrl: './talent-card.css'
})
export class TalentCard {

  @Input() talent!: TalentCardData;


  @Output() viewProfile =
    new EventEmitter<TalentCardData>();

  @Output() save =
    new EventEmitter<TalentCardData>();


  onViewProfile(): void {

    this.viewProfile.emit(this.talent);

  }


  onSave(): void {

    this.save.emit(this.talent);

  }


  get visibleSkills(): string[] {

    return this.talent?.skills?.slice(0, 3) ?? [];

  }


  get remainingSkills(): number {

    const total =
      this.talent?.skills?.length ?? 0;

    return Math.max(total - 3, 0);

  }


  get location(): string {

    if (this.talent?.city && this.talent?.country) {

      return `${this.talent.city}, ${this.talent.country}`;

    }

    return this.talent?.city ||
      this.talent?.country ||
      '';

  }


  get isActive(): boolean {

    return this.talent?.status === 'active';

  }

}