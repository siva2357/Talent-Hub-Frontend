
import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



declare var bootstrap: any;

@Component({
  selector: 'app-applicants-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applicants-list-page.html',
  styleUrl: './applicants-list-page.css',
})
export class ApplicantsListPage {


}
