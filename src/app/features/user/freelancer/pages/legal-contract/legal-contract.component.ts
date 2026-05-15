import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-legal-contract',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent],
  templateUrl: './legal-contract.component.html',
  styleUrl: './legal-contract.component.css'
})
export class LegalContractComponent implements OnInit {
  offerId: string | null = null;
  hasAgreed = false;
  isSigning = false;
  signatureImage: string | null = null;
  
  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.offerId = this.route.snapshot.paramMap.get('id');
  }

  triggerSignatureUpload(input: HTMLInputElement) {
    input.click();
  }

  onSignatureFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.signatureImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  signContract() {
    if (this.hasAgreed && this.signatureImage) {
      this.isSigning = true;
      // Simulate signing delay
      setTimeout(() => {
        this.isSigning = false;
        this.router.navigate(['/user/active-contracts']);
      }, 2000);
    }
  }
}
