import { RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, InputComponent, ButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {

}
