export interface ActiveFilter {
  id: string;
  label: string;
  type: 'search' | 'date' | 'budget' | 'status';
}

export interface Offer {
  id: string;
  contractTitle: string;
  client: string;
  date: string;
  budget: string;
  contractType: 'Fixed Price' | 'Hourly';
  level: 'Entry' | 'Intermediate' | 'Expert';
  description: string;
  techStack: string[];
  expiresIn: string;
  startDate: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

export interface DashboardStat {
  label: string;
  value: string | number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'gold';
  statusText?: string;
}

export interface RecentActivity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
  status: 'completed' | 'pending' | 'urgent';
}

export interface ActiveContract {
  id: string; // applicationId
  contractId: string; // actual contractId
  contractTitle: string;
  client: string;
  clientInitials: string;
  budget: string;
  contractType: 'Fixed Price' | 'Hourly';
  techStack: string[];
  startDate: string;
  status: 'in-progress' | 'upcoming' | 'completed';
  description: string;
}
