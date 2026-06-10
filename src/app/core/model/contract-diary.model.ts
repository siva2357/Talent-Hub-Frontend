// models/attachment.model.ts

export interface Attachment {
  _id?: string;

  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
}

export interface Revision {
  _id: string;

  freelancerNote: string;

  clientFeedback: string;

  status:
    | 'submitted'
    | 'changes-requested'
    | 'approved';

  submittedAt: string;

  reviewedAt: string | null;

  attachments: Attachment[];
}

export interface Phase {
  _id: string;

  name: string;

  description: string;

  deadline: string;

  amount: number;

  status:
    | 'pending'
    | 'in-progress'
    | 'submitted'
    | 'changes-requested'
    | 'approved'
    | 'overdue';

  revisions: Revision[];

  revisionCount: number;

  clientAttachments: Attachment[];

  approvedAt: string | null;

  submittedAt: string | null;
}

export interface Diary {
  _id: string;

  overallStatus:
    | 'not-started'
    | 'in-progress'
    | 'completed'
    | 'cancelled';

  contractId: {
    _id?: string;

    contractTitle: string;

    estimatedBudget: number;

    budgetType: string;

    contractStartDate: string;

    contractEndDate: string;

    contractDescription?: string;

    techStack?: string[];

    spent?: number;

    funded?: number;
  };

  freelancerId: {
    _id?: string;

    registrationDetails: {
      fullName: string;
      email?: string;
    };
  };

  clientId?: {
    _id?: string;

    registrationDetails: {
      fullName: string;
      email?: string;
    };
  };

  phases: Phase[];

  createdAt?: string;

  updatedAt?: string;
}