import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Buttons } from "../../components/buttons/buttons";

@Component({
  selector: 'app-confirmation-page',
  standalone: true,
  imports: [RouterModule, Buttons],
  templateUrl: './confirmation-page.html',
  styleUrl: './confirmation-page.css'
})
export class ConfirmationPage {

}
