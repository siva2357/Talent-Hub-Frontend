import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  status: 'Published' | 'Draft';
  author: BlogAuthor;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private initialPosts: BlogPost[] = [
    {
      id: 'b1',
      title: 'How AI Intelligence helps users discover opportunities',
      slug: 'how-ai-intelligence-helps-users',
      description: 'Explore how our advanced AI algorithms analyze skills and market trends to provide the most relevant contract recommendations.',
      category: 'Artificial Intelligence',
      image: '/assets/images/blog/ai_intelligence_blog.png',
      date: 'May 10, 2026',
      readTime: '5 min read',
      status: 'Published',
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
          <ul class="text-secondary d-grid gap-3" style="list-style: none; padding-left: 0;">
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
      id: 'b2',
      title: 'Our Service: A Comprehensive Guide to Talent Hub',
      slug: 'our-service-comprehensive-guide',
      description: 'Discover the full suite of tools and services designed to empower freelancers and businesses in the modern remote work era.',
      category: 'Services',
      image: '/assets/images/blog/talent_hub_services_blog.png',
      date: 'May 08, 2026',
      readTime: '8 min read',
      status: 'Published',
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
    },
    {
      id: 'b3',
      title: 'How We Work: Building a Seamless Freelancing Ecosystem',
      slug: 'how-we-work-seamless-ecosystem',
      description: 'A deep dive into our operational philosophy and how we ensure a smooth collaboration between talent and clients.',
      category: 'Workflow',
      image: '/assets/images/blog/how_we_work_blog.png',
      date: 'May 05, 2026',
      readTime: '6 min read',
      status: 'Published',
      author: {
        name: 'Jane Doe',
        role: 'Operations Director',
        avatar: 'assets/images/profiles/avatar-3.jpg'
      },
      content: `
        <p class="lead text-secondary">Operational workflows are key to delivering projects on schedule. In this guide, we discuss how Talent Hub bridges communication and tasks between developers and clients.</p>
        <h2 class="fw-bold mt-5 mb-4 text-white">Milestone Tracking</h2>
        <p class="text-secondary">Projects are split into milestones, ensuring clear expectations, progressive validation, and safe payouts. Admins monitor milestone dispute resolutions statefully.</p>
      `
    },
    {
      id: 'b4',
      title: 'Smart Matching: How Talent Meets Intelligence',
      slug: 'smart-matching-talent-meets-intelligence',
      description: 'Learn about the technology behind our matching system and how it ensures the perfect fit for every project.',
      category: 'Technology',
      image: '/assets/images/blog/talent_match_blog.png',
      date: 'May 02, 2026',
      readTime: '7 min read',
      status: 'Published',
      author: {
        name: 'Alex Rivera',
        role: 'Lead Architect',
        avatar: 'assets/images/profiles/avatar-4.jpg'
      },
      content: `
        <p class="lead text-secondary">Matching talent with contracts goes beyond mere keyword searches. We combine ratings, completed projects, and skill metrics to suggest ideal candidates.</p>
      `
    },
    {
      id: 'b5',
      title: 'Secure Payments: Ensuring Trust with Legal Contracts',
      slug: 'secure-payments-ensuring-trust',
      description: 'Everything you need to know about our milestone-based payment system and how we protect every transaction.',
      category: 'Security',
      image: '/assets/images/blog/secure_payments_blog.png',
      date: 'April 28, 2026',
      readTime: '10 min read',
      status: 'Published',
      author: {
        name: 'Sarah Connor',
        role: 'Security Specialist',
        avatar: 'assets/images/profiles/avatar-5.jpg'
      },
      content: `
        <p class="lead text-secondary">Escrow payments keep contract funds secure. Freelancers work with peace of mind knowing the funds are guaranteed, and clients pay only upon approval.</p>
      `
    }
  ];

  private postsSubject = new BehaviorSubject<BlogPost[]>(this.initialPosts);

  getPosts(): Observable<BlogPost[]> {
    return this.postsSubject.asObservable();
  }

  getPublishedPosts(): Observable<BlogPost[]> {
    return this.postsSubject.pipe(
      map(posts => posts.filter(post => post.status === 'Published'))
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    return this.postsSubject.pipe(
      map(posts => posts.find(p => p.slug === slug))
    );
  }

  addPost(title: string, description: string, content: string, category: string, readTime: string, status: 'Published' | 'Draft', mediaType?: 'image' | 'video', mediaUrl?: string): void {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const defaultImage = '/assets/images/blog/ai_intelligence_blog.png';
    const postImage = mediaType === 'image' && mediaUrl ? mediaUrl : defaultImage;

    const newPost: BlogPost = {
      id: `b${this.postsSubject.value.length + 1}`,
      title,
      slug,
      description,
      content,
      category,
      image: postImage,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: readTime || '5 min read',
      status,
      author: {
        name: 'Admin Desk',
        role: 'Platform Administrator',
        avatar: 'assets/images/profiles/avatar-1.jpg'
      },
      mediaType,
      mediaUrl
    };

    this.postsSubject.next([newPost, ...this.postsSubject.value]);
  }

  togglePostStatus(id: string): void {
    const updated = this.postsSubject.value.map((post): BlogPost => {
      if (post.id === id) {
        const nextStatus: 'Published' | 'Draft' = post.status === 'Published' ? 'Draft' : 'Published';
        return { ...post, status: nextStatus };
      }
      return post;
    });
    this.postsSubject.next(updated);
  }

  deletePost(id: string): void {
    const updated = this.postsSubject.value.filter(post => post.id !== id);
    this.postsSubject.next(updated);
  }
}
