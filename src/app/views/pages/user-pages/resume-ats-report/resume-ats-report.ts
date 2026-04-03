import { Component, OnInit } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatbotService } from '../../../../core/services/chatbot-service';
import { ResumeService } from '../../../../core/services/resume-service';

Chart.register(DoughnutController, ArcElement, Tooltip);

@Component({
  selector: 'app-resume-ats-report',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resume-ats-report.html',
  styleUrl: './resume-ats-report.css',
})
export class ResumeAtsReport implements OnInit {

  loading = false;
  analysis: any;
  atsScore = 0;

  constructor(
    private route: ActivatedRoute,
      private resumeService: ResumeService
  ) {}

  // ✅ Get URL from query param
ngOnInit() {
  this.loading = true;
  this.analysis = null; // ✅ ADD THIS

  const id = this.route.snapshot.queryParamMap.get('id');

  if (id) {
    this.getResumeFromDB(id);
  }
}

getResumeFromDB(id: string) {
  this.loading = true;
  this.analysis = null; // ✅ ADD THIS
  this.resumeService.getResumeById(id).subscribe({
    next: (res: any) => {
      const data = res.data;

if (data.analysis?.ats_score > 0){
  console.log("✅ Using saved analysis");

  this.analysis = data.analysis;
  this.atsScore = this.analysis.ats_score;

this.loading = false;

setTimeout(() => {
  this.renderChart();
}, 0);
}
      // ✅ CASE 2: analysis missing → run analysis using resumeUrl
      else if (data.resumeUrl) {
        console.log("⚡ No analysis found → running analysis");

        this.fetchAnalysis(data.resumeUrl);
      }

      else {
        console.error("❌ No resume URL found");
        this.loading = false;
      }
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

  // ✅ Call API
fetchAnalysis(url: string) {
  this.resumeService.analyzeResume(url).subscribe({
    next: (res: any) => {
      this.analysis = res.data?.data || res.data;
      this.atsScore = this.analysis?.ats_score || 0;

      const id = this.route.snapshot.queryParamMap.get('id');
      if (id) {
        this.updateAnalysis(id);
      }

      this.loading = false;

      setTimeout(() => {
        this.renderChart();
      }, 0);
    },
    error: (err) => {
      console.error("❌ Analysis failed", err);
      this.loading = false; // ❗ IMPORTANT
    }
  });
}


  saveResumeToDB(url: string) {
  const payload = {
    resumeUrl: url,
    fileName: 'resume.pdf',
    analysis: this.analysis
  };

  this.resumeService.saveResume(payload).subscribe({
    next: () => {
      console.log('✅ Resume saved to DB');
    },
    error: (err) => {
      console.error('❌ Save failed', err);
    }
  });
}

updateAnalysis(id: string) {
  this.resumeService.updateAnalysis(id, {
    analysis: this.analysis
  }).subscribe({
    next: () => console.log("✅ Analysis updated"),
    error: (err) => console.error(err)
  });
}

  // ✅ Chart render (single place only)
renderChart() {
  const ctx = document.getElementById('atsScoreChart') as HTMLCanvasElement;

  if (!ctx) return;

  // ✅ destroy existing chart if exists
  if ((window as any).atsChart) {
    (window as any).atsChart.destroy();
  }

  const scoreColor = this.getScoreColor(this.atsScore);

  (window as any).atsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [this.atsScore, 100 - this.atsScore],
        backgroundColor: [scoreColor, '#e9ecef'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: { enabled: false }
      }
    }
  });
}

  // ✅ Helpers
  getScoreColor(score: number): string {
    if (score >= 80) return '#28a745';
    if (score >= 50) return '#fdbd0d';
    return '#dc3545';
  }

  getMatchLabel(score: number): string {
    if (score >= 80) return 'Excellent Match';
    if (score >= 50) return 'Average Match';
    return 'Poor Match';
  }

  getBadgeClass(score: number): string {
    if (score >= 80) return 'bg-success';
    if (score >= 50) return 'bg-warning text-dark';
    return 'bg-danger';
  }
}
