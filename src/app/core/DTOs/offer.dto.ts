export interface SendOfferDto {
  scopeOfWork?: string;
  additionalTerms?: string;
  clientSignature?: string | null;
}

export interface SignOfferDto {
  freelancerSignature?: string | null;
}

export interface OfferDetails {
  _id: string;
  applicationId: string;
  contractId: any;
  clientId: any;
  freelancerId: any;
  scopeOfWork: string;
  additionalTerms: string;
  offerStatus: 'sent' | 'accepted' | 'declined' | 'revoked';
  clientSignature: string;
  freelancerSignature: string;
  signedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfferResponse {
  success: boolean;
  message?: string;
  offer?: OfferDetails;
}

export interface FreelancerOffersResponse {
  success: boolean;
  offers: any[];
}
