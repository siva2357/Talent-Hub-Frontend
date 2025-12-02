import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-recruiter',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './recruiter.html',
  styleUrl: './recruiter.css',
  standalone: true,
})
export class Recruiter {}
