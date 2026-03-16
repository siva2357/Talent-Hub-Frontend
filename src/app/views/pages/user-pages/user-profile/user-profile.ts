import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Buttons } from "../../../components/buttons/buttons";
import { Badges } from "../../../components/badges/badges";
import { InputFields } from "../../../components/input-fields/input-fields";
import { Table } from "../../../components/table/table";
import { TalentCard } from "../../../components/talent-card/talent-card";
import { JobpostCard } from "../../../components/jobpost-card/jobpost-card";

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, Buttons, Badges, InputFields, Table, TalentCard, JobpostCard],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
    standalone: true,
})
export class UserProfile {

}
