import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  selectedCategory: string = 'All Posts';
  
  categories = [
    'All Posts',
    'Artificial Intelligence',
    'Services',
    'Workflow',
    'Technology',
    'Security'
  ];

  blogPosts = [
    {
      id: 1,
      title: 'How AI Intelligence helps users discover opportunities',
      slug: 'how-ai-intelligence-helps-users',
      description: 'Explore how our advanced AI algorithms analyze skills and market trends to provide the most relevant contract recommendations.',
      category: 'Artificial Intelligence',
      image: '/assets/images/blog/ai_intelligence_blog.png',
      date: 'May 10, 2026',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Our Service: A Comprehensive Guide to Talent Hub',
      slug: 'our-service-comprehensive-guide',
      description: 'Discover the full suite of tools and services designed to empower freelancers and businesses in the modern remote work era.',
      category: 'Services',
      image: '/assets/images/blog/talent_hub_services_blog.png',
      date: 'May 08, 2026',
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'How We Work: Building a Seamless Freelancing Ecosystem',
      slug: 'how-we-work-seamless-ecosystem',
      description: 'A deep dive into our operational philosophy and how we ensure a smooth collaboration between talent and clients.',
      category: 'Workflow',
      image: '/assets/images/blog/how_we_work_blog.png',
      date: 'May 05, 2026',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Smart Matching: How Talent Meets Intelligence',
      slug: 'smart-matching-talent-meets-intelligence',
      description: 'Learn about the technology behind our matching system and how it ensures the perfect fit for every project.',
      category: 'Technology',
      image: '/assets/images/blog/talent_match_blog.png',
      date: 'May 02, 2026',
      readTime: '7 min read'
    },
    {
      id: 5,
      title: 'Secure Payments: Ensuring Trust with Legal Contracts',
      slug: 'secure-payments-ensuring-trust',
      description: 'Everything you need to know about our milestone-based payment system and how we protect every transaction.',
      category: 'Security',
      image: '/assets/images/blog/secure_payments_blog.png',
      date: 'April 28, 2026',
      readTime: '10 min read'
    }
  ];

  get filteredPosts() {
    if (this.selectedCategory === 'All Posts') {
      return this.blogPosts;
    }
    return this.blogPosts.filter(post => post.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  onCategoryChange(event: any) {
    const category = event.target.value;
    this.selectCategory(category);
  }
}
