import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

export interface ClientData {
  id: string;
  name: string; // Company Name
  clientName: string; // Client Contact Name
  email: string;
  phoneNumber: string;
  spent: number;
  projectsCount: number;
  status: 'Active' | 'Suspended' | 'Blocked' | 'Deactivated';
  joinedDate: string;
  logoColor: string;
  industry: string;
}

export interface FreelancerData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  skills: string[];
  hourlyRate: number;
  completedProjects: number;
  earnings: number;
  status: 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated';
  joinedDate: string;
  rating: number;
  title: string;
}

export interface TransactionData {
  id: string;
  clientName: string;
  freelancerName: string;
  amount: number;
  platformFee: number;
  status: 'Completed' | 'Pending' | 'Refunded';
  date: string;
  type: 'Escrow Deposit' | 'Freelancer Payout' | 'Commission Fee';
}

export interface SystemReport {
  id: string;
  title: string;
  description: string;
  category: 'Financial' | 'User Activity' | 'Platform Health';
  generatedDate: string;
  downloadUrl: string;
  size: string;
}

export interface SupportRequestReply {
  sender: 'Admin' | 'User';
  message: string;
  timestamp: string;
}

export interface SupportRequest {
  id: string;
  userType: 'Client' | 'Freelancer';
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  attachments?: { name: string; url: string }[];
  status: 'Pending' | 'Resolved' | 'Unresolved';
  createdDate: string;
  replies?: SupportRequestReply[];
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  private getHeaders() {
    const token = localStorage.getItem('th_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // Stateful BehaviorSubjects to simulate real-time admin changes
  private clientsSubject = new BehaviorSubject<ClientData[]>([
    { id: 'c1', name: 'Stripe Inc.', clientName: 'John Collison', email: 'john.collison@stripe.com', phoneNumber: '+1 (555) 019-2834', spent: 125400, projectsCount: 14, status: 'Active', joinedDate: '2025-01-15', logoColor: 'indigo', industry: 'Financial Services' },
    { id: 'c2', name: 'Netflix', clientName: 'Ted Sarandos', email: 'ted.sarandos@netflix.com', phoneNumber: '+1 (555) 014-9988', spent: 89300, projectsCount: 8, status: 'Active', joinedDate: '2025-02-10', logoColor: 'danger', industry: 'Entertainment' },
    { id: 'c3', name: 'Airbnb', clientName: 'Brian Chesky', email: 'brian.chesky@airbnb.com', phoneNumber: '+1 (555) 017-4433', spent: 45000, projectsCount: 5, status: 'Suspended', joinedDate: '2025-03-01', logoColor: 'rose', industry: 'Hospitality & Travel' },
    { id: 'c4', name: 'Duolingo', clientName: 'Luis von Ahn', email: 'luis.vonahn@duolingo.com', phoneNumber: '+1 (555) 012-7766', spent: 62700, projectsCount: 9, status: 'Active', joinedDate: '2025-03-24', logoColor: 'success', industry: 'Education & Tech' },
    { id: 'c5', name: 'Vercel', clientName: 'Guillermo Rauch', email: 'guillermo.rauch@vercel.com', phoneNumber: '+1 (555) 018-1122', spent: 104500, projectsCount: 11, status: 'Active', joinedDate: '2025-04-05', logoColor: 'dark', industry: 'Cloud & DevOps' },
    { id: 'c6', name: 'Figma', clientName: 'Dylan Field', email: 'dylan.field@figma.com', phoneNumber: '+1 (555) 015-3344', spent: 23000, projectsCount: 3, status: 'Active', joinedDate: '2025-04-18', logoColor: 'purple', industry: 'Design software' },
  ]);

  private freelancersSubject = new BehaviorSubject<FreelancerData[]>([
    { id: 'f1', name: 'Alex Rivera', email: 'alex.rivera@dev.io', phoneNumber: '+1 (555) 011-2233', skills: ['Angular', 'TypeScript', 'Node.js'], hourlyRate: 85, completedProjects: 24, earnings: 74200, status: 'Active', joinedDate: '2025-01-08', rating: 4.9, title: 'Senior Angular Developer' },
    { id: 'f2', name: 'Sophia Chen', email: 'sophia.c@design.co', phoneNumber: '+1 (555) 016-5544', skills: ['UI/UX', 'Figma', 'Webflow'], hourlyRate: 90, completedProjects: 19, earnings: 63000, status: 'Active', joinedDate: '2025-02-14', rating: 5.0, title: 'Lead Product Designer' },
    { id: 'f3', name: 'Marcus Johnson', email: 'marcus.j@cyber.net', phoneNumber: '+1 (555) 013-8877', skills: ['Python', 'Django', 'PostgreSQL'], hourlyRate: 75, completedProjects: 12, earnings: 34100, status: 'Pending Approval', joinedDate: '2025-05-10', rating: 4.5, title: 'Backend Security Engineer' },
    { id: 'f4', name: 'Elena Rostova', email: 'elena.r@mobile.dev', phoneNumber: '+1 (555) 019-6655', skills: ['React Native', 'Swift', 'Kotlin'], hourlyRate: 95, completedProjects: 31, earnings: 98400, status: 'Active', joinedDate: '2025-01-20', rating: 4.8, title: 'Senior Mobile Engineer' },
    { id: 'f5', name: 'David Kim', email: 'david.kim@fullstack.me', phoneNumber: '+1 (555) 012-9900', skills: ['React', 'Next.js', 'GraphQL'], hourlyRate: 80, completedProjects: 15, earnings: 42800, status: 'Suspended', joinedDate: '2025-03-11', rating: 4.2, title: 'Fullstack JavaScript Architect' },
    { id: 'f6', name: 'Amara Okafor', email: 'amara.o@ai.com', phoneNumber: '+1 (555) 015-8899', skills: ['Machine Learning', 'Python', 'PyTorch'], hourlyRate: 110, completedProjects: 7, earnings: 51200, status: 'Pending Approval', joinedDate: '2025-05-20', rating: 4.7, title: 'AI & Data Research Engineer' },
  ]);

  private transactionsSubject = new BehaviorSubject<TransactionData[]>([
    { id: 'tx1001', clientName: 'Stripe Inc.', freelancerName: 'Alex Rivera', amount: 4500, platformFee: 450, status: 'Completed', date: '2026-05-27', type: 'Escrow Deposit' },
    { id: 'tx1002', clientName: 'Netflix', freelancerName: 'Sophia Chen', amount: 3200, platformFee: 320, status: 'Completed', date: '2026-05-26', type: 'Freelancer Payout' },
    { id: 'tx1003', clientName: 'Vercel', freelancerName: 'Elena Rostova', amount: 6800, platformFee: 680, status: 'Completed', date: '2026-05-25', type: 'Escrow Deposit' },
    { id: 'tx1004', clientName: 'Duolingo', freelancerName: 'Alex Rivera', amount: 1500, platformFee: 150, status: 'Pending', date: '2026-05-25', type: 'Commission Fee' },
    { id: 'tx1005', clientName: 'Airbnb', freelancerName: 'David Kim', amount: 2400, platformFee: 240, status: 'Refunded', date: '2026-05-20', type: 'Escrow Deposit' },
    { id: 'tx1006', clientName: 'Figma', freelancerName: 'Sophia Chen', amount: 5000, platformFee: 500, status: 'Completed', date: '2026-05-18', type: 'Freelancer Payout' },
  ]);

  private reportsSubject = new BehaviorSubject<SystemReport[]>([
    { id: 'rep1', title: 'Q2 Platform Revenue & Transaction Audit', description: 'Complete audit of commissions, deposits, and withdrawal margins for Q2.', category: 'Financial', generatedDate: '2026-05-28', downloadUrl: '#', size: '2.4 MB' },
    { id: 'rep2', title: 'Monthly Active Users & Growth Metrics', description: 'Breakdown of new client signups, freelancer approvals, and retention rates.', category: 'User Activity', generatedDate: '2026-05-25', downloadUrl: '#', size: '1.8 MB' },
    { id: 'rep3', title: 'Job Matching & Fill Rate Analysis', description: 'Report measuring time-to-hire, project success rates, and category demand.', category: 'Platform Health', generatedDate: '2026-05-20', downloadUrl: '#', size: '940 KB' },
    { id: 'rep4', title: 'Disputes, Refunds & Escrow Release Report', description: 'Analysis of platform disputes, arbitration times, and total refunded volume.', category: 'Financial', generatedDate: '2026-05-15', downloadUrl: '#', size: '1.2 MB' },
  ]);

  private supportRequestsSubject = new BehaviorSubject<SupportRequest[]>([
    { 
      id: 'tkt101', 
      userType: 'Client', 
      userName: 'John Collison', 
      userEmail: 'john.collison@stripe.com', 
      subject: 'Escrow payment verification failure', 
      message: 'I initiated a deposit of $4,500 but it is still showing as pending verification on my portal. Please expedite.', 
      status: 'Pending', 
      createdDate: '2026-05-27',
      replies: []
    },
    { 
      id: 'tkt102', 
      userType: 'Freelancer', 
      userName: 'Alex Rivera', 
      userEmail: 'alex.rivera@dev.io', 
      subject: 'Payout delay to bank account', 
      message: 'My payout request was marked completed on the system, but the funds have not arrived in my bank account yet.', 
      status: 'Pending', 
      createdDate: '2026-05-26',
      replies: [
        { sender: 'Admin', message: 'Hello Alex, we have processed the transfer on our end. Transaction ref: ACH-99281. Could you check with your bank if there is a temporary hold on inbound deposits?', timestamp: '09:30 AM' },
        { sender: 'User', message: 'Hi support team, I called Chase bank and they do not see any incoming transaction with that reference number. Can you verify if the account number details match?', timestamp: '11:15 AM' }
      ]
    },
    { 
      id: 'tkt103', 
      userType: 'Client', 
      userName: 'Ted Sarandos', 
      userEmail: 'ted.sarandos@netflix.com', 
      subject: 'VAT invoice generation request', 
      message: 'We require a customized VAT-compliant invoice for our finance department records. Thanks.', 
      status: 'Resolved', 
      createdDate: '2026-05-25',
      replies: [
        { sender: 'Admin', message: 'Hello Ted, I have compiled your VAT invoice for the billing period ending May 2026. A copy has been dispatched to your email, and you can also download it under the Billing section. Let us know if you need anything else!', timestamp: '04:20 PM' }
      ]
    },
    { 
      id: 'tkt104', 
      userType: 'Freelancer', 
      userName: 'Sophia Chen', 
      userEmail: 'sophia.c@design.co', 
      subject: 'Profile skills tag update issue', 
      message: 'I tried adding Vercel and Gatsby to my stack but the system returns a validation error.', 
      status: 'Pending', 
      createdDate: '2026-05-24',
      replies: []
    }
  ]);

  private activitiesSubject = new BehaviorSubject<any[]>([
    { id: 1, user: 'Vercel', action: 'deposited $104,500 into project escrow.', project: 'NextJS Optimization', time: '10 mins ago', icon: 'bi-cash-coin', type: 'deposit' },
    { id: 2, user: 'Marcus Johnson', action: 'submitted a profile approval request.', project: 'Freelancer Profile', time: '2 hours ago', icon: 'bi-person-plus', type: 'approval' },
    { id: 3, user: 'Airbnb', action: 'account status updated to Suspended by Admin.', project: 'System Action', time: '5 hours ago', icon: 'bi-slash-circle', type: 'system' },
    { id: 4, user: 'Elena Rostova', action: 'withdrew $4,850 earnings from wallet.', project: 'Payout Successful', time: '1 day ago', icon: 'bi-wallet2', type: 'payout' },
    { id: 5, user: 'Stripe Inc.', action: 'completed payment contract for Alex Rivera.', project: 'Billing Portal v2', time: '2 days ago', icon: 'bi-check2-circle', type: 'milestone' }
  ]);

  // Clients API
  getClients(): Observable<ClientData[]> {
    return this.http.get<ClientData[]>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.CLIENTS}`,
      this.getHeaders()
    );
  }

  updateClientStatus(id: string, newStatus: 'Active' | 'Suspended' | 'Blocked' | 'Deactivated'): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.UPDATE_CLIENT_STATUS(id)}`,
      { status: newStatus },
      this.getHeaders()
    );
  }

  // Freelancers API
  getFreelancers(): Observable<FreelancerData[]> {
    return this.http.get<FreelancerData[]>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.FREELANCERS}`,
      this.getHeaders()
    );
  }

  updateFreelancerStatus(id: string, newStatus: 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated'): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.UPDATE_FREELANCER_STATUS(id)}`,
      { status: newStatus },
      this.getHeaders()
    );
  }

  approveFreelancer(id: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.APPROVE_FREELANCER(id)}`,
      {},
      this.getHeaders()
    );
  }

  // Transactions / Finances API
  getTransactions(): Observable<TransactionData[]> {
    return this.transactionsSubject.asObservable();
  }

  getFinancialStats(): Observable<{
    totalVolume: number;
    platformCommissions: number;
    escrowHeld: number;
    growthPercent: number;
  }> {
    return of({
      totalVolume: 434900,
      platformCommissions: 43490,
      escrowHeld: 8300,
      growthPercent: 18.5
    });
  }

  // Reports API
  getReports(): Observable<SystemReport[]> {
    return this.reportsSubject.asObservable();
  }

  generateReport(title: string, category: 'Financial' | 'User Activity' | 'Platform Health', description: string): void {
    const newReport: SystemReport = {
      id: `rep${this.reportsSubject.value.length + 1}`,
      title,
      description,
      category,
      generatedDate: new Date().toISOString().split('T')[0],
      downloadUrl: '#',
      size: '120 KB'
    };
    this.reportsSubject.next([newReport, ...this.reportsSubject.value]);
    this.addActivity({
      user: 'Admin',
      action: `generated report: "${title}"`,
      project: 'System Reports',
      time: 'Just now',
      icon: 'bi-file-earmark-plus',
      type: 'system'
    });
  }

  // Dashboard Stats API
  getDashboardStats(): Observable<{
    totalClients: number;
    totalFreelancers: number;
    activeContracts: number;
    totalCommissions: number;
  }> {
    return this.http.get<{
      totalClients: number;
      totalFreelancers: number;
      activeContracts: number;
      totalCommissions: number;
    }>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DASHBOARD_STATS}`,
      this.getHeaders()
    );
  }

  getRecentActivities(): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.getDashboardStats().subscribe({
        next: (data: any) => {
          observer.next(data.activities || []);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  // Support Requests API
  getSupportRequests(): Observable<SupportRequest[]> {
    return this.http.get<SupportRequest[]>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.GET_ALL_TICKETS}`,
      this.getHeaders()
    );
  }

  updateSupportRequestStatus(id: string, status: 'Pending' | 'Resolved' | 'Unresolved'): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.UPDATE_STATUS(id)}`,
      { status },
      this.getHeaders()
    );
  }

  replyToSupportRequest(id: string, message: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.REPLY(id)}`,
      { message },
      this.getHeaders()
    );
  }

  submitUserFeedbackAndResolve(id: string, message: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.FEEDBACK(id)}`,
      { feedbackText: message },
      this.getHeaders()
    );
  }

  // Private helpers
  private addActivity(activity: { user: string; action: string; project: string; time: string; icon: string; type: string }): void {
    const currentList = this.activitiesSubject.value;
    const newActivity = {
      id: currentList.length + 1,
      ...activity
    };
    this.activitiesSubject.next([newActivity, ...currentList.slice(0, 9)]);
  }
}
