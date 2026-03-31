import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user-service';

@Component({
  selector: 'app-saved-talents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-talents.html',
  styleUrl: './saved-talents.css',
})
export class SavedTalents implements OnInit {

  savedTalentData: any[] = [];

  constructor(private talentService: UserService) {}

  ngOnInit() {
    this.loadSavedTalents();
  }

  loadSavedTalents() {
    this.talentService.getSavedTalents().subscribe(res => {
      this.savedTalentData = res.data || [];
    });
  }

  // 🔥 REMOVE (unsave)
  unsaveTalent(talent: any) {
    this.talentService.unsaveTalent(talent._id).subscribe(() => {

      // ✅ remove instantly from UI
      this.savedTalentData = this.savedTalentData.filter(t => t._id !== talent._id);

    });
  }

selectedTalent: any = null;

viewProfile(talent: any) {
  this.talentService.getTalentProfileById(talent._id).subscribe(res => {

    this.selectedTalent = res.data; // ✅ IMPORTANT

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('talentModal')
    );
    modal.show();
  });
}



}
