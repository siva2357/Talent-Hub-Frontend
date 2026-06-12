import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
})
export class ConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  role: 'freelancer' | 'client' = 'freelancer';
  isSuccess = true;
  email = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const qRole = params['role'];
      if (qRole && qRole.toLowerCase() === 'client') {
        this.role = 'client';
      } else {
        this.role = 'freelancer';
      }

      this.email = params['email'] || '';

      const successParam = params['success'];
      if (successParam === 'false') {
        this.isSuccess = false;
      } else {
        this.isSuccess = true;
      }
    });
  }
}
