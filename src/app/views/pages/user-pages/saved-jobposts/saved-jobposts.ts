import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-saved-jobposts',
  imports: [RouterModule ],
  templateUrl: './saved-jobposts.html',
  styleUrl: './saved-jobposts.css',
})
export class SavedJobposts {
jobs = [
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

{
id:7,
jobId:'JOB-007',
title:'UI/UX Designer',
category:'Design',
type:'Contract',
location:'Mumbai',
company:'Adobe',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/adobe.svg',
description:'Design intuitive user interfaces, build wireframes and prototypes, and collaborate with developers on product design.'
},

{
id:8,
jobId:'JOB-008',
title:'Machine Learning Engineer',
category:'Data Science',
type:'Full Time',
location:'Hyderabad',
company:'Nvidia',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nvidia.svg',
description:'Develop machine learning models, optimize training pipelines, and deploy AI solutions into production systems.'
},

{
id:9,
jobId:'JOB-009',
title:'Cloud Engineer',
category:'Backend',
type:'Full Time',
location:'Bangalore',
company:'Oracle',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/oracle.svg',
description:'Design and manage scalable cloud infrastructure, configure networking services, and ensure system reliability.'
},

{
id:10,
jobId:'JOB-010',
title:'Java Backend Developer',
category:'Backend',
type:'Internship',
location:'Pune',
company:'SAP',
logo:'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/sap.svg',
description:'Assist in developing backend APIs using Java and Spring Boot, support database integration, and maintain application services.'
}

];


}
