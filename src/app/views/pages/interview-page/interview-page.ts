import { Component } from '@angular/core';
import { HeaderLayout } from '../../layouts/header-layout/header-layout';
import { FooterLayout } from '../../layouts/footer-layout/footer-layout';

@Component({
  selector: 'app-interview-page',
  imports: [HeaderLayout,FooterLayout],
  templateUrl: './interview-page.html',
  styleUrl: './interview-page.css',
    standalone: true,
})
export class InterviewPage {

}
