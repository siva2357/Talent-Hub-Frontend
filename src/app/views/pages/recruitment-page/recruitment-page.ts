import { Component } from '@angular/core';
import { HeaderLayout } from '../../layouts/header-layout/header-layout';
import { FooterLayout } from '../../layouts/footer-layout/footer-layout';

@Component({
  selector: 'app-recruitment-page',
  imports: [HeaderLayout,FooterLayout],
  templateUrl: './recruitment-page.html',
  styleUrl: './recruitment-page.css',
    standalone: true,
})
export class RecruitmentPage {

}
