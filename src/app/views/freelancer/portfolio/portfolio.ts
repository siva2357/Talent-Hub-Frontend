import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class Portfolio implements OnInit {
  portfolios: any[] = [];
  isLoading = true;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.fetchPortfolios();
  }

  fetchPortfolios() {
    this.isLoading = true;
    this.portfolioService.getMyPortfolios().subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolios = res.portfolios || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching portfolios', err);
        this.isLoading = false;
      }
    });
  }

  deletePortfolio(id: string) {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      this.portfolioService.deletePortfolio(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolios = this.portfolios.filter(p => p._id !== id);
          }
        },
        error: (err) => console.error('Error deleting portfolio', err)
      });
    }
  }
}

