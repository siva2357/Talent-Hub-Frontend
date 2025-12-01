import { Component } from '@angular/core';
import { HeaderLayout } from '../../layouts/header-layout/header-layout';

@Component({
  selector: 'app-landing-page',
  imports: [HeaderLayout],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  standalone: true,
})
export class LandingPage {

}
