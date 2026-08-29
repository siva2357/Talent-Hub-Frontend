export interface FeedbackData {
  contractId: string;
  freelancerId: string;
  overallRating: number;
  categories: {
    qualityOfWork: number;
    requirementsAndDeliverables: number;
    communication: number;
    timeliness: number;
    behaviorAndProfessionalism: number;
  };
  clientComments: string;
  pros: string[];
  cons: string[];
}
