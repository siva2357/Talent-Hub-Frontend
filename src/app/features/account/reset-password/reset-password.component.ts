import { RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, InputComponent, ButtonComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {

}
