import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user-service';


@Component({
  selector: 'app-talents',
  templateUrl: './talents.html',
  styleUrl: './talents.css',
  standalone: true,
  imports: [RouterModule,CommonModule, FormsModule,ReactiveFormsModule],
})
export class Talents  {
talents = [
{
  name:'Noah Thompson',
  role:'Product Designer',
  email:'noah@email.com',
  phone:'+1 234 567 890',
  location:'New York, USA',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=1'
},
{
  name:'Emma Watson',
  role:'UI Designer',
  email:'emma@email.com',
  phone:'+1 222 456 789',
  location:'London, UK',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=2'
},
{
  name:'Liam Carter',
  role:'Angular Developer',
  email:'liam@email.com',
  phone:'+1 333 456 111',
  location:'Toronto, Canada',
  status:'Inactive',
  avatar:'https://i.pravatar.cc/120?img=3'
},
];

talentData: any[] = [];
selectedTalent: any = null;

constructor(private talentService: UserService) {}

ngOnInit() {
  this.loadTalents();
}

loadTalents() {
  this.talentService.getAllTalents().subscribe(res => {
    if (res?.data) {
      this.talentData = res.data;
    }
  });
}

viewProfile(talent: any) {
  this.talentService.getTalentProfileById(talent._id).subscribe(res => {

    this.selectedTalent = res.data; // ✅ IMPORTANT

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('talentModal')
    );
    modal.show();
  });
}

saveTalent(talent: any) {
  if (talent.isSaved) {
    alert('Already saved');
    return;
  }

  this.talentService.saveTalent(talent._id).subscribe({
    next: () => {
      talent.isSaved = true;
    },
    error: (err) => {
      if (err?.error?.message === 'Talent already saved') {
        alert('Already saved');
      }
    }
  });
}


}
