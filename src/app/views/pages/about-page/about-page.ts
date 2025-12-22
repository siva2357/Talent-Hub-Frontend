import { Component } from '@angular/core';
import { HeaderLayout } from '../../layouts/header-layout/header-layout';
import { FooterLayout } from '../../layouts/footer-layout/footer-layout';

@Component({
  selector: 'app-about-page',
  imports: [HeaderLayout,FooterLayout],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
    standalone: true,
})
export class AboutPage {

}
