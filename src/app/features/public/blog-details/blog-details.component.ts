import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit {
  post: any;
  
  allPosts = [
    {
      id: 1,
      title: 'How AI Intelligence helps users discover opportunities',
      slug: 'how-ai-intelligence-helps-users',
      category: 'Artificial Intelligence',
      image: '/assets/images/blog/ai_intelligence_blog.png',
      date: 'May 10, 2026',
      readTime: '5 min read',
      author: {
        name: 'Dr. Sarah Chen',
        role: 'Head of AI',
        avatar: 'assets/images/profiles/avatar-1.jpg'
      },
      content: `
        <p class="lead text-secondary">Artificial Intelligence is no longer just a buzzword; it is the backbone of the modern freelancing economy. At Talent Hub, we have harnessed the power of advanced AI to bridge the gap between world-class talent and high-impact opportunities.</p>
        
        <h2 class="fw-bold mt-5 mb-4 text-white">The Power of Intelligent Recommendations</h2>
        <p class="text-secondary">Our AI doesn't just look for keywords. It understands context, intent, and soft skills. By analyzing thousands of successful project completions, the algorithm identifies patterns that lead to long-term success. For a freelancer, this means receiving recommendations that aren't just "relevant" but are truly aligned with their career trajectory.</p>
        
        <div class="my-5 p-5 glass rounded-5 border-start border-brand border-5">
          <h4 class="fw-bold mb-3 text-white">Key AI Features in Talent Hub:</h4>
          <ul class="text-secondary d-grid gap-3">
            <li><i class="bi bi-check2 text-brand me-2"></i> Semantic skill analysis beyond basic keywords</li>
            <li><i class="bi bi-check2 text-brand me-2"></i> Predictive project success scoring</li>
            <li><i class="bi bi-check2 text-brand me-2"></i> Real-time market trend integration</li>
            <li><i class="bi bi-check2 text-brand me-2"></i> Personalized career growth suggestions</li>
          </ul>
        </div>

        <h2 class="fw-bold mt-5 mb-4 text-white">Continuous Learning and Adaptation</h2>
        <p class="text-secondary">One of the most powerful aspects of our intelligence system is its ability to learn. Every interaction, every feedback loop, and every successfully delivered milestone helps the system refine its understanding of what makes a perfect match. This constant evolution ensures that the platform remains at the cutting edge of the industry.</p>
      `
    },
    {
      id: 2,
      title: 'Our Service: A Comprehensive Guide to Talent Hub',
      slug: 'our-service-comprehensive-guide',
      category: 'Services',
      image: '/assets/images/blog/talent_hub_services_blog.png',
      date: 'May 08, 2026',
      readTime: '8 min read',
      author: {
        name: 'Michael Ross',
        role: 'Product Lead',
        avatar: 'assets/images/profiles/avatar-2.jpg'
      },
      content: `
        <p class="lead text-secondary">Talent Hub is more than a marketplace; it's a comprehensive ecosystem designed to manage the entire lifecycle of remote work. From the first handshake to the final payment, our services are built with transparency and efficiency at their core.</p>
        
        <h2 class="fw-bold mt-5 mb-4 text-white">A Centralized Workspace for Modern Teams</h2>
        <p class="text-secondary">Managing multiple freelancers and projects can be chaotic. Our centralized workspace simplifies this by bringing chat, file sharing, meeting scheduling, and task tracking into one unified interface. This reduces friction and allows teams to focus on what matters most: delivering high-quality results.</p>

        <h2 class="fw-bold mt-5 mb-4 text-white">Integrated Financial Services</h2>
        <p class="text-secondary">Trust is built on reliable financial interactions. Our integrated payment system supports multiple currencies, provides detailed invoicing, and ensures that funds are held securely until milestones are met. This protects both the talent and the client, creating a safe environment for global collaboration.</p>
      `
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.post = this.allPosts.find(p => p.slug === slug) || this.allPosts[0];
      window.scrollTo(0, 0);
    });
  }
}
