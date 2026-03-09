import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-recruiter',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recruiter.html',
  styleUrl: './recruiter.css'
})
export class Recruiter  {


}
