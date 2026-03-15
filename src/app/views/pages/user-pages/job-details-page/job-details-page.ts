import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-details-page.html',
  styleUrls: ['./job-details-page.css']
})
export class JobDetailsPage {


job = {
  title: 'Senior Angular Developer',
  company: 'TechNova Solutions',
  logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',

  category: 'Frontend Development',
  type: 'Full Time',
  location: 'Hyderabad',

  salary: '₹12L – ₹18L',
  experience: '3 - 5 Years',
  level: 'Mid Level',
  workMode: 'Hybrid',

  description:
    'We are looking for an experienced Angular developer to build scalable web applications. You will collaborate with designers and backend engineers to create high performance applications.',

  responsibilities: [
    'Develop scalable web applications',
    'Build reusable Angular components',
    'Integrate REST APIs',
    'Collaborate with cross-functional teams'
  ],

  skills: [
    'Angular',
    'TypeScript',
    'REST API',
    'Git'
  ],

  benefits: [
    'Health Insurance',
    'Flexible working hours',
    'Remote work support',
    'Learning & development budget'
  ],

  posted: '3 days ago',
  applicants: 24
};


  recommendedJobs = [
{
id:1,
jobId:'JOB-001',
title:'Angular Developer',
category:'Frontend',
type:'Full Time',
location:'Hyderabad',
company:'Google',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg',
description:'Build scalable Angular applications, create reusable UI components, and integrate REST APIs for enterprise platforms.'
},

{
id:2,
jobId:'JOB-002',
title:'Node.js Backend Developer',
category:'Backend',
type:'Full Time',
location:'Bangalore',
company:'Microsoft',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg',
description:'Develop backend services using Node.js and Express, design REST APIs, and manage PostgreSQL database operations.'
},

{
id:3,
jobId:'JOB-003',
title:'React Frontend Engineer',
category:'Frontend',
type:'Contract',
location:'Pune',
company:'Netflix',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg',
description:'Develop modern React interfaces, optimize UI performance, and collaborate with backend teams to deliver scalable web apps.'
},

{
id:4,
jobId:'JOB-004',
title:'Full Stack Developer',
category:'Full Stack',
type:'Full Time',
location:'Chennai',
company:'Amazon',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg',
description:'Work across frontend and backend layers using modern frameworks, develop APIs, and maintain scalable applications.'
},

{
id:5,
jobId:'JOB-005',
title:'Python Data Analyst',
category:'Data Science',
type:'Part Time',
location:'Remote',
company:'Meta',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/meta.svg',
description:'Analyze large datasets using Python, create dashboards and visualizations, and generate insights for business teams.'
},

{
id:6,
jobId:'JOB-006',
title:'DevOps Engineer',
category:'Backend',
type:'Full Time',
location:'Delhi',
company:'IBM',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ibm.svg',
description:'Manage CI/CD pipelines, automate infrastructure deployment, and monitor cloud environments for reliability.'
},
];

}
