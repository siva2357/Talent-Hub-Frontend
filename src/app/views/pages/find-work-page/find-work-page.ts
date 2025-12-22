import { Component } from '@angular/core';
import { HeaderLayout } from '../../layouts/header-layout/header-layout';
import { FooterLayout } from '../../layouts/footer-layout/footer-layout';

@Component({
  selector: 'app-find-work-page',
  imports: [HeaderLayout,FooterLayout],
  templateUrl: './find-work-page.html',
  styleUrl: './find-work-page.css',
    standalone: true,
})
export class FindWorkPage {

}
