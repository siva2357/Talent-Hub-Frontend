import { Component } from '@angular/core';
import { HeaderLayout } from '../../layouts/header-layout/header-layout';
import { FooterLayout } from '../../layouts/footer-layout/footer-layout';

@Component({
  selector: 'app-blog-page',
  imports: [HeaderLayout,FooterLayout],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css',
    standalone: true,
})
export class BlogPage {

}
