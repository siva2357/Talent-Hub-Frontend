import { Component } from '@angular/core';
import { HeaderLayout } from '../../layouts/header-layout/header-layout';
import { FooterLayout } from '../../layouts/footer-layout/footer-layout';

@Component({
  selector: 'app-landing-page',
  imports: [HeaderLayout,FooterLayout],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  standalone: true,
})
export class LandingPage {

}
