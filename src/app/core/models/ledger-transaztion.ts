export interface LedgerTransaction {
    id: string;
    contractTitle: string;
    clientName: string;
    freelancerName: string;
    budget: number;
    freelancerPayment: number;
    amount?: number;
    platformFee: number;
    status: string;
    date?: string;
    type?: string;
}

