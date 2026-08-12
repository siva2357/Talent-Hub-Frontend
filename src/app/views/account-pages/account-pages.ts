import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../library/ui/layouts/sidebar/sidebar';

@Component({
  selector: 'app-account-pages',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './account-pages.html',
  styleUrl: './account-pages.css'
})
export class AccountPages {

}
