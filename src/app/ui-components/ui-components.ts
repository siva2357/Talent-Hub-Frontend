import { Component, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../library/ui/layouts/sidebar/sidebar';

import { Accordion } from '../library/ui/components/accordion/accordion';
import { Alert } from '../library/ui/components/alert/alert';
import { Badge } from '../library/ui/components/badge/badge';
import { Chip } from '../library/ui/components/chip/chip';
import { InputField } from '../library/ui/components/input-field/input-field';
import { Loader } from '../library/ui/components/loader/loader';
import { Modal } from '../library/ui/components/modal/modal';
import { Pagination } from '../library/ui/components/pagination/pagination';
import { Table, TableColumn } from '../library/ui/components/table/table';
import { Toast } from '../library/ui/components/toast/toast';

import { Timeline, TimelineStep } from '../library/shared/components/timeline/timeline';
import { ProfileAvatar } from '../library/shared/components/profile-avatar/profile-avatar';
import { NotificationDropdown } from '../library/shared/components/notification-dropdown/notification-dropdown';
import { FileUpload } from '../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../library/shared/components/file-preview/file-preview';
import { TalentCard, TalentCardData } from '../library/shared/components/talent-card/talent-card';
import { MeetCard, MeetCardData } from '../library/shared/components/meet-card/meet-card';
import { SupportTicket, SupportTicketData } from '../library/shared/components/support-ticket/support-ticket';
import { ContractCard, ContractCardData } from '../library/shared/components/contract-card/contract-card';

import { UserNavbar } from '../library/ui/layouts/user-navbar/user-navbar';

import { Button } from '../library/ui/components/button/button';
import { StatCard, StatCardData } from '../library/shared/components/stat-card/stat-card';

@Component({
  selector: 'app-ui-components',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    UserNavbar,
    Accordion, Alert, Badge, Button, Chip, InputField, Loader, Modal, Pagination, Table, Toast,
    Timeline, ProfileAvatar, NotificationDropdown, FileUpload, FilePreview,
    TalentCard, MeetCard, SupportTicket, ContractCard, StatCard
  ],
  templateUrl: './ui-components.html',
  styleUrl: './ui-components.css'
})
export class UiComponents implements AfterViewInit {

  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.tableColumns[3].cellTemplate = this.statusTemplate;
      this.tableColumns[4].cellTemplate = this.actionsTemplate;
    });
  }

  tableColumns: TableColumn[] = [
    { field: 'name', headerName: 'Employee Name' },
    { field: 'role', headerName: 'Role' },
    { field: 'department', headerName: 'Department' },
    { field: 'status', headerName: 'Status' },
    { field: 'actions', headerName: 'Actions' }
  ];

  tableData = [
    { name: 'Sarah Smith', role: 'Software Engineer', status: 'Active', department: 'Engineering' },
    { name: 'Michael Chen', role: 'Product Manager', status: 'On Leave', department: 'Product' },
    { name: 'Emily Davis', role: 'UX Designer', status: 'Active', department: 'Design' },
    { name: 'James Wilson', role: 'Data Analyst', status: 'Active', department: 'Data Science' },
    { name: 'Jessica Taylor', role: 'HR Business Partner', status: 'Inactive', department: 'Human Resources' }
  ];




  isSaving = false;
  isLoading = false;

  onPrimaryClick(event: Event): void {
    console.log('Primary clicked', event);
  }

  onSecondaryClick(event: Event): void {
    console.log('Secondary clicked', event);
  }

  addItem(): void {
    console.log('Add item');
  }

  editItem(): void {
    console.log('Edit item');
  }

  deleteItem(): void {
    console.log('Delete item');
  }

  viewItem(): void {
    console.log('View item');
  }

  saveData(): void {
    console.log('Save');
  }

  submitForm(): void {
    console.log('Submit');
  }

  cancel(): void {
    console.log('Cancel');
  }

  downloadFile(): void {
    console.log('Download');
  }

  uploadFile(): void {
    console.log('Upload');
  }

  search(): void {
    console.log('Search');
  }

  successAction(): void {
    console.log('Success');
  }

  onClick(event: Event): void {
    console.log('Button clicked', event);
  }

  onButtonClick(event: Event): void {
    console.log('Button clicked:', event);
  }


  onSuccessClick(event: Event): void {
    console.log('Success button clicked', event);
  }

  onDangerClick(event: Event): void {
    console.log('Danger button clicked', event);
  }

  onWarningClick(event: Event): void {
    console.log('Warning button clicked', event);
  }

  onInfoClick(event: Event): void {
    console.log('Info button clicked', event);
  }

  onLightClick(event: Event): void {
    console.log('Light button clicked', event);
  }

  onDarkClick(event: Event): void {
    console.log('Dark button clicked', event);
  }

  onLinkClick(event: Event): void {
    console.log('Link button clicked', event);
  }

  onOutlinePrimaryClick(event: Event): void {
    console.log('Outline Primary clicked', event);
  }

  onOutlineSuccessClick(event: Event): void {
    console.log('Outline Success clicked', event);
  }

  onOutlineDangerClick(event: Event): void {
    console.log('Outline Danger clicked', event);
  }

  onOutlineWarningClick(event: Event): void {
    console.log('Outline Warning clicked', event);
  }

  onOutlineInfoClick(event: Event): void {
    console.log('Outline Info clicked', event);
  }

  onOutlineLightClick(event: Event): void {
    console.log('Outline Light clicked', event);
  }

  onOutlineDarkClick(event: Event): void {
    console.log('Outline Dark clicked', event);
  }



  onChipRemoved(label: string): void {
    console.log(`${label} chip removed`);
  }




  dummyContracts: ContractCardData[] = [

    {
      industry: 'Information Technology',

      contractTitle: 'Website Development & UI Design',

      estimatedBudget: 150000,

      contractDescription:
        'Looking for an experienced developer to design and develop a modern responsive business website with a clean user interface.',

      contractStartDate: '2026-09-01',

      contractEndDate: '2026-11-30',

      contractType: 'Fixed Price',

      contractSubject: 'Web Development',

      totalDuration: '3 Months',

      status: 'active',

      hasApplied: false,

      hasSaved: false
    },

    {
      industry: 'Finance & Banking',

      contractTitle: 'Financial Dashboard Development',

      estimatedBudget: 225000,

      contractDescription:
        'Develop a responsive financial dashboard with analytics, reports, charts and role-based access for business users.',

      contractStartDate: '2026-09-15',

      contractEndDate: '2027-01-15',

      contractType: 'Fixed Price',

      contractSubject: 'Dashboard Development',

      totalDuration: '4 Months',

      status: 'pending',

      hasApplied: true,

      hasSaved: true
    },

    {
      industry: 'E-Commerce',

      contractTitle: 'E-Commerce Platform Development',

      estimatedBudget: 350000,

      contractDescription:
        'Build a complete e-commerce platform with product management, shopping cart, checkout, payment integration and order management.',

      contractStartDate: '2026-10-01',

      contractEndDate: '2027-03-31',

      contractType: 'Fixed Price',

      contractSubject: 'E-Commerce Development',

      totalDuration: '6 Months',

      status: 'active',

      hasApplied: false,

      hasSaved: true
    }

  ];


  talentCards: TalentCardData[] = [

    {
      _id: 'talent-001',
      userId: 'user-001',

      profilePhoto: 'https://i.pravatar.cc/150?img=12',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      gender: 'Female',

      categories: [
        'Web Development',
        'UI/UX Design'
      ],

      skills: [
        'Angular',
        'TypeScript',
        'Figma',
        'Bootstrap',
        'UI Design'
      ],

      country: 'India',
      city: 'Bangalore',
      state: 'Karnataka',

      availability: [
        'Full Time',
        'Immediate'
      ],

      createdAt: '2026-01-15',
      updatedAt: '2026-08-20',

      activeContracts: 2,
      completedContracts: 18,

      jobSuccessRate: 96,
      riskStatus: 'Low',

      isSaved: false,
      status: 'active'
    },


    {
      _id: 'talent-002',
      userId: 'user-002',

      profilePhoto: 'https://i.pravatar.cc/150?img=32',
      fullName: 'Michael Anderson',
      email: 'michael.anderson@example.com',
      gender: 'Male',

      categories: [
        'Backend Development',
        'Cloud'
      ],

      skills: [
        'ASP.NET Core',
        'C#',
        'SQL Server',
        'Azure',
        'REST API'
      ],

      country: 'India',
      city: 'Hyderabad',
      state: 'Telangana',

      availability: [
        'Part Time',
        'Available Soon'
      ],

      createdAt: '2025-11-10',
      updatedAt: '2026-08-18',

      activeContracts: 1,
      completedContracts: 24,

      jobSuccessRate: 91,
      riskStatus: 'Low',

      isSaved: true,
      status: 'active'
    },


    {
      _id: 'talent-003',
      userId: 'user-003',

      profilePhoto: 'https://i.pravatar.cc/150?img=47',
      fullName: 'Emily Williams',
      email: 'emily.williams@example.com',
      gender: 'Female',

      categories: [
        'UI/UX Design',
        'Product Design'
      ],

      skills: [
        'Figma',
        'Adobe XD',
        'UX Research',
        'Prototyping',
        'Design Systems'
      ],

      country: 'India',
      city: 'Pune',
      state: 'Maharashtra',

      availability: [
        'Full Time'
      ],

      createdAt: '2026-02-05',
      updatedAt: '2026-08-22',

      activeContracts: 3,
      completedContracts: 31,

      jobSuccessRate: 98,
      riskStatus: 'Low',

      isSaved: false,
      status: 'active'
    }

  ];

  onContractViewDetails(
    contract: ContractCardData
  ): void {

    console.log('View Details:', contract);

  }


  onContractSave(
    contract: ContractCardData
  ): void {

    console.log('Save Contract:', contract);

    contract.hasSaved = !contract.hasSaved;

  }


  onContractApply(
    contract: ContractCardData
  ): void {

    console.log('Apply Contract:', contract);

  }



  onTalentViewProfile(
    talent: TalentCardData
  ): void {

    console.log('View Profile:', talent);

  }


  onTalentSave(
    talent: TalentCardData
  ): void {

    console.log('Save Talent:', talent);

    talent.isSaved = !talent.isSaved;

  }




  meetCards: MeetCardData[] = [

    {
      _id: 'meet-001',

      interview: {
        title: 'Frontend Developer Interview',
        description:
          'Technical discussion for the frontend development contract. Join link: https://meet.google.com/abc-defg-hij',
        date: '2026-09-02T10:30:00',
        status: 'scheduled',
        feedback: ''
      },

      contractTitle: 'E-Commerce Website Development',

      otherUser: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com'
      },

      applicationStatus: 'Shortlisted'
    },


    {
      _id: 'meet-002',

      interview: {
        title: 'UI/UX Designer Interview',
        description:
          'Portfolio and design discussion for the product design contract. Join link: https://meet.google.com/xyz-uvwx-rst',
        date: '2026-09-04T14:00:00',
        status: 'upcoming',
        feedback: ''
      },

      contractTitle: 'Mobile Application UI/UX Design',

      otherUser: {
        name: 'Priya Nair',
        email: 'priya.nair@example.com'
      },

      applicationStatus: 'Interview Scheduled'
    },


    {
      _id: 'meet-003',

      interview: {
        title: 'Backend Developer Discussion',
        description:
          'Technical interview covering ASP.NET Core, APIs and database architecture. Join link: https://meet.google.com/lmn-opqr-stu',
        date: '2026-09-06T11:00:00',
        status: 'pending',
        feedback: ''
      },

      contractTitle: 'Enterprise API Development',

      otherUser: {
        name: 'Arjun Kumar',
        email: 'arjun.kumar@example.com'
      },

      applicationStatus: 'Pending'
    }

  ];


  onMeetViewDetails(
    meet: MeetCardData
  ): void {

    console.log('View Interview Details:', meet);

  }


  onMeetJoin(
    meet: MeetCardData
  ): void {

    console.log('Joined Interview:', meet);

  }


  supportTickets: SupportTicketData[] = [

    {
      _id: 'ticket-001',
      ticketId: 'TKT-1001',

      userId: 'user-001',
      userType: 'Client',
      userName: 'Rahul Sharma',
      userEmail: 'rahul.sharma@example.com',

      subject: 'Unable to access payment dashboard',

      category: 'Payment',

      priority: 'High',

      message:
        'I am unable to access the payment dashboard and receive an error when trying to load the page.',

      attachments: [
        {
          name: 'payment-error.png',
          url: '#',
          _id: 'attachment-001'
        }
      ],

      status: 'Open',

      replies: [
        {
          sender: 'Support Team',
          message:
            'We have received your request and our team is investigating the issue.',
          _id: 'reply-001',
          attachments: [],
          timestamp: '2026-08-24T10:30:00'
        },
        {
          sender: 'Rahul Sharma',
          message:
            'Thank you. Please let me know once the issue has been resolved.',
          _id: 'reply-002',
          attachments: [],
          timestamp: '2026-08-24T12:15:00'
        }
      ],

      createdAt: '2026-08-24T10:00:00',
      updatedAt: '2026-08-24T12:15:00',

      __v: 0
    },


    {
      _id: 'ticket-002',
      ticketId: 'TKT-1002',

      userId: 'user-002',
      userType: 'Talent',
      userName: 'Priya Nair',
      userEmail: 'priya.nair@example.com',

      subject: 'Unable to update profile information',

      category: 'Account',

      priority: 'Medium',

      message:
        'I am unable to update my profile information. The changes are not being saved after submitting the form.',

      attachments: [],

      status: 'Pending',

      replies: [
        {
          sender: 'Support Team',
          message:
            'We are checking the profile update issue and will get back to you shortly.',
          _id: 'reply-003',
          attachments: [],
          timestamp: '2026-08-23T09:20:00'
        }
      ],

      createdAt: '2026-08-23T09:00:00',
      updatedAt: '2026-08-23T09:20:00',

      __v: 0
    },


    {
      _id: 'ticket-003',
      ticketId: 'TKT-1003',

      userId: 'user-003',
      userType: 'Client',
      userName: 'Arjun Kumar',
      userEmail: 'arjun.kumar@example.com',

      subject: 'Contract application issue',

      category: 'Contracts',

      priority: 'Low',

      message:
        'I was unable to submit an application for a contract. The issue has now been resolved by the support team.',

      attachments: [
        {
          name: 'application-error.pdf',
          url: '#',
          _id: 'attachment-002'
        },
        {
          name: 'screenshot.png',
          url: '#',
          _id: 'attachment-003'
        }
      ],

      status: 'Closed',

      replies: [
        {
          sender: 'Support Team',
          message:
            'The contract application issue has been resolved. You can now submit your application.',
          _id: 'reply-004',
          attachments: [],
          timestamp: '2026-08-20T14:30:00'
        },
        {
          sender: 'Arjun Kumar',
          message:
            'Confirmed. I can submit the application successfully now. Thank you.',
          _id: 'reply-005',
          attachments: [],
          timestamp: '2026-08-20T15:00:00'
        },
        {
          sender: 'Support Team',
          message:
            'Glad to hear that. We are closing this ticket.',
          _id: 'reply-006',
          attachments: [],
          timestamp: '2026-08-20T15:15:00'
        }
      ],

      createdAt: '2026-08-19T11:00:00',
      updatedAt: '2026-08-20T15:15:00',

      __v: 0
    }

  ];

  onTicketViewDetails(
    ticket: SupportTicketData
  ): void {

    console.log('View Ticket:', ticket);

  }



  statCards: StatCardData[] = [

    {
      title: 'Total Contracts',
      value: 128,
      icon: 'bi bi-file-earmark-text'
    },

    {
      title: 'Active Contracts',
      value: 42,
      icon: 'bi bi-briefcase-fill'
    },

    {
      title: 'Completed Contracts',
      value: 86,
      icon: 'bi bi-check-circle-fill'
    },

    {
      title: 'Total Talents',
      value: 356,
      icon: 'bi bi-people-fill'
    },

    {
      title: 'Open Tickets',
      value: 14,
      icon: 'bi bi-ticket-detailed-fill'
    },

    {
      title: 'Upcoming Interviews',
      value: 23,
      icon: 'bi bi-calendar-event-fill'
    }

  ];


  profileFillupSteps: TimelineStep[] = [

    {
      title: 'Basic Information',
      description: 'Add your name, email and personal details.',
      status: 'completed',
      icon: 'bi bi-person'
    },

    {
      title: 'Professional Information',
      description: 'Add your professional experience and category.',
      status: 'completed',
      icon: 'bi bi-briefcase'
    },

    {
      title: 'Skills & Expertise',
      description: 'Add your skills and areas of expertise.',
      status: 'active',
      icon: 'bi bi-stars'
    },

    {
      title: 'Profile Verification',
      description: 'Verify your profile information.',
      status: 'upcoming',
      icon: 'bi bi-shield-check'
    },

    {
      title: 'Profile Completed',
      description: 'Your profile is ready to use.',
      status: 'upcoming',
      icon: 'bi bi-check-circle'
    }

  ];


  // =========================================
  // 2. CREATE CONTRACT MULTI-STEP FORM
  // =========================================

  createContractSteps: TimelineStep[] = [

    {
      title: 'Contract Details',
      description: 'Enter the contract title, subject and description.',
      status: 'completed',
      icon: 'bi bi-file-earmark-text'
    },

    {
      title: 'Requirements',
      description: 'Define skills, experience and project requirements.',
      status: 'completed',
      icon: 'bi bi-list-check'
    },

    {
      title: 'Budget & Duration',
      description: 'Set the project budget and expected duration.',
      status: 'active',
      icon: 'bi bi-currency-rupee'
    },

    {
      title: 'Review Contract',
      description: 'Review all contract information before publishing.',
      status: 'upcoming',
      icon: 'bi bi-eye'
    },

    {
      title: 'Publish Contract',
      description: 'Publish the contract and start receiving applications.',
      status: 'upcoming',
      icon: 'bi bi-send'
    }

  ];


  // =========================================
  // 3. RECRUITMENT WORKFLOW
  // WITHOUT ICONS
  // =========================================

  recruitmentWorkflowSteps: TimelineStep[] = [

    {
      title: 'Application Received',
      description: 'Candidate submitted an application.',
      status: 'completed'
    },

    {
      title: 'Application Review',
      description: 'Recruiter is reviewing the candidate profile.',
      status: 'completed'
    },

    {
      title: 'Shortlisted',
      description: 'Candidate has been shortlisted for the next stage.',
      status: 'active'
    },

    {
      title: 'Interview',
      description: 'Interview will be scheduled with the candidate.',
      status: 'upcoming'
    },

    {
      title: 'Final Decision',
      description: 'Final hiring decision will be made.',
      status: 'upcoming'
    },

    {
      title: 'Offer',
      description: 'Offer will be sent to the selected candidate.',
      status: 'upcoming'
    }

  ];


  // =========================================
  // 4. PROGRESS TIMELINE
  // =========================================

  progressTimelineSteps: TimelineStep[] = [

    {
      title: 'Project Started',
      description: 'Project requirements have been confirmed.',
      status: 'completed'
    },

    {
      title: 'Development',
      description: 'Development work is currently in progress.',
      status: 'active'
    },

    {
      title: 'Testing',
      description: 'Testing will begin after development is completed.',
      status: 'upcoming'
    },

    {
      title: 'Client Review',
      description: 'Client will review the completed work.',
      status: 'upcoming'
    },

    {
      title: 'Completed',
      description: 'Project will be marked as completed.',
      status: 'upcoming'
    }

  ];

}
