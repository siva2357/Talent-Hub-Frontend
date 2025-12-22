import { Component } from '@angular/core';
import { HeaderLayout } from '../../layouts/header-layout/header-layout';
import { FooterLayout } from '../../layouts/footer-layout/footer-layout';

@Component({
  selector: 'app-resume-builder-page',
  imports: [HeaderLayout,FooterLayout],
  templateUrl: './resume-builder-page.html',
  styleUrl: './resume-builder-page.css',
    standalone: true,
})
export class ResumeBuilderPage {

}
