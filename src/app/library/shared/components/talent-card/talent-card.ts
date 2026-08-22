import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

export interface TalentCardData {

  _id: string;
  userId: string;

  profilePhoto: string;
  fullName: string;
  email: string;
  gender: string;

  categories: string[];
  skills: string[];

  country: string;
  city: string;
  state: string;

  availability: string[];

  createdAt: string;
  updatedAt: string;

  activeContracts: number;
  completedContracts: number;

  // Optional future backend values
  jobSuccessRate?: number;
  riskStatus?: string;

  isSaved: boolean;
  status: string;
}


@Component({
  selector: 'app-talent-card',
  standalone: true,
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