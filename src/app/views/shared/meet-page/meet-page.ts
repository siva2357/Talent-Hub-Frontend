import { Component } from '@angular/core';

@Component({
  selector: 'app-meet-page',
  imports: [],
  templateUrl: './meet-page.html',
  styleUrl: './meet-page.css'
})
export class MeetPage {
  mode: 'meeting' | 'interview' = 'meeting'; // 'meeting' or 'interview'
}
