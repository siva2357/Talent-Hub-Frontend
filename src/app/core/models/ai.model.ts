export interface AIChatRequest {
  query: string;
  top_k?: number;
}

export interface AIChatResponse {
  query: string;
  summary: string;
}

export interface AIStatusResponse {
  status: string;
  service: string;
}

export interface ContractMatch {
  contract_id: string;
  contract_title: string;
  match_percentage: number;
  match_category: 'High' | 'Average' | 'Low';
  reasoning: string;
}

export interface ContractMatchResponse {
  matches: {
    results: ContractMatch[];
  };
}
