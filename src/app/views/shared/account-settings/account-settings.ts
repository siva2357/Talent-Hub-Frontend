import { Component } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  imports: [],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css'
})
export class AccountSettings {
  role: string = 'freelancer'; // 'client' or 'freelancer'
  activeTab: string = 'profile';

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
