import { Component } from '@angular/core';
import { HeaderLayout } from '../../../layouts/header-layout/header-layout';
import { FooterLayout } from '../../../layouts/footer-layout/footer-layout';
@Component({
  selector: 'app-talent-marketplace-page',
  imports: [HeaderLayout,FooterLayout],
  templateUrl: './talent-marketplace-page.html',
  styleUrl: './talent-marketplace-page.css',
    standalone: true,
})
export class TalentMarketplacePage {

}
