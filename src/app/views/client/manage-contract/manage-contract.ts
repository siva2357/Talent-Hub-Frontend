import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Contract {
  id: number;
  title: string;
  subject: string;
  type: string;
  budget: string;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'Active' | 'Draft';
}

@Component({
  selector: 'app-manage-contract',
  imports: [RouterLink],
  templateUrl: './manage-contract.html',
  styleUrl: './manage-contract.css'
})
export class ManageContract {
  contracts: Contract[] = [
    {
      id: 1,
      title: 'E-Commerce Website',
      subject: 'Online Store',
      type: 'Full Stack Development',
      budget: '₹60,000.00',
      startDate: 'Jun 30, 2026',
      endDate: 'Sep 30, 2026',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Mobile App Redesign',
      subject: 'UI/UX Design',
      type: 'Design',
      budget: '₹45,000.00',
      startDate: 'Jul 15, 2026',
      endDate: 'Oct 15, 2026',
      status: 'Active'
    },
    {
      id: 3,
      title: 'SEO Optimization',
      subject: 'Digital Marketing',
      type: 'Marketing',
      budget: '₹20,000.00',
      startDate: 'Aug 01, 2026',
      endDate: 'Nov 01, 2026',
      status: 'Active'
    },
    {
      id: 4,
      title: 'CRM Integration',
      subject: 'Backend System',
      type: 'Backend Development',
      budget: '₹85,000.00',
      startDate: 'Aug 10, 2026',
      endDate: 'Dec 10, 2026',
      status: 'Draft'
    },
    {
      id: 5,
      title: 'Logo & Brand Identity',
      subject: 'Branding',
      type: 'Graphic Design',
      budget: '₹15,000.00',
      startDate: 'Sep 05, 2026',
      endDate: 'Sep 25, 2026',
      status: 'Completed'
    }
  ];
}
