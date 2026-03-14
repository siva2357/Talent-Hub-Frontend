import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-portfolio',
  imports: [RouterModule,CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
  standalone: true,
})
export class Portfolio  {

  selectedProject:any = null;
isEditMode = false;


selectProject(project:any){
  this.isEditMode = true;
  this.selectedProject = { ...project };
}

addProject(){
  this.isEditMode = false;

  this.selectedProject = {
    title:'',
    category:'',
    type:'',
    tags:[],
    description:'',
    image:''
  };
}

projects = [
{
id:1,
title:'Talent Hub Platform',
category:'Full Stack',
type:'Web App',
tags:['Angular','Node.js','PostgreSQL'],
description:'Job portal platform connecting recruiters and developers.',
image:'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
},
{
id:2,
title:'AI Resume Analyzer',
category:'AI Tool',
type:'Web App',
tags:['Python','LLM','RAG'],
description:'AI powered resume ATS analyzer for job seekers.',
image:'https://images.unsplash.com/photo-1518770660439-4636190af475'
},
{
id:3,
title:'Portfolio Builder',
category:'Frontend',
type:'Web App',
tags:['Angular','Bootstrap'],
description:'Drag and drop portfolio builder for developers.',
image:'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
},
{
id:4,
title:'E-Commerce Dashboard',
category:'Frontend',
type:'Dashboard',
tags:['Angular','Chart.js','Bootstrap'],
description:'Admin dashboard for monitoring orders, revenue and users.',
image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
},
{
id:5,
title:'Real Time Chat App',
category:'Full Stack',
type:'Web App',
tags:['Node.js','Socket.io','Express'],
description:'Real-time messaging application with private chat rooms.',
image:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'
},
{
id:6,
title:'AI Image Generator',
category:'AI Tool',
type:'Web App',
tags:['Python','Stable Diffusion','FastAPI'],
description:'Generate AI images using prompt-based image generation models.',
image:'https://images.unsplash.com/photo-1677442136019-21780ecad995'
},
{
id:7,
title:'Expense Tracker',
category:'Frontend',
type:'Web App',
tags:['Angular','LocalStorage','Bootstrap'],
description:'Track daily expenses and visualize spending patterns.',
image:'https://images.unsplash.com/photo-1554224155-6726b3ff858f'
},
{
id:8,
title:'Weather Forecast App',
category:'Frontend',
type:'Web App',
tags:['Angular','API','Bootstrap'],
description:'Weather forecasting application using external APIs.',
image:'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b'
},
{
id:9,
title:'Task Management System',
category:'Full Stack',
type:'Web App',
tags:['Node.js','Angular','MongoDB'],
description:'Collaborative task management platform for teams.',
image:'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b'
},
{
id:10,
title:'Stock Market Analyzer',
category:'Data Science',
type:'Analytics Tool',
tags:['Python','Pandas','Visualization'],
description:'Analyze stock trends and visualize market insights.',
image:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'
},
{
id:11,
title:'Fitness Tracking App',
category:'Mobile App',
type:'Health Tech',
tags:['Flutter','Firebase','Health API'],
description:'Mobile application to track workouts, calories, and health metrics.',
image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
},
{
id:12,
title:'Smart Home Dashboard',
category:'IoT',
type:'Web Dashboard',
tags:['Angular','MQTT','Node.js'],
description:'Dashboard for monitoring and controlling smart home devices.',
image:'https://images.unsplash.com/photo-1558002038-1055907df827'
}
];




}
