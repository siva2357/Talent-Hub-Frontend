import { Component } from '@angular/core';

interface JobPost {
  id: string;
  company: string;
  jobTitle: string;
  description: string;
  location: string;
  jobType: string;
  workMode: string;
  posted: string;
  logo: string;
}

@Component({
  selector: 'app-jobposts',
  standalone: true,
  templateUrl: './jobposts.html',
  styleUrl: './jobposts.css'
})
export class Jobposts {

  jobPosts: JobPost[] = [

    {
      id: "JOB001",
      company: "TechNova Solutions",
      jobTitle: "Angular Developer",
      description: "Build modern UI and scalable Angular 16+ apps.",
      location: "Hyderabad",
      jobType: "Full-time",
      workMode: "Remote",
      posted: "14h ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB002",
      company: "CloudBridge Pvt Ltd",
      jobTitle: "Node.js Backend Engineer",
      description: "Develop APIs with Node.js, MongoDB, scalable architecture.",
      location: "Bangalore",
      jobType: "Full-time",
      workMode: "On-site",
      posted: "1 day ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB003",
      company: "PixelCraft Studios",
      jobTitle: "UI/UX Designer",
      description: "Design clean interfaces for mobile & web applications.",
      location: "Chennai",
      jobType: "Contract",
      workMode: "Remote",
      posted: "3 days ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB004",
      company: "InnoSoft Labs",
      jobTitle: "React Developer",
      description: "Work on modern React 18 SPAs with Redux Toolkit.",
      location: "Delhi",
      jobType: "Full-time",
      workMode: "Hybrid",
      posted: "12h ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB005",
      company: "ByteWave Systems",
      jobTitle: "DevOps Engineer",
      description: "Manage CI/CD pipelines, Docker, Kubernetes.",
      location: "Pune",
      jobType: "Full-time",
      workMode: "Remote",
      posted: "5h ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB006",
      company: "FutureTech AI",
      jobTitle: "Machine Learning Engineer",
      description: "Build ML pipelines, model training, optimization.",
      location: "Mumbai",
      jobType: "Full-time",
      workMode: "On-site",
      posted: "2 days ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB007",
      company: "NextGen Web",
      jobTitle: "Frontend Developer",
      description: "HTML, CSS, Bootstrap, JavaScript & modern frameworks.",
      location: "Kolkata",
      jobType: "Part-time",
      workMode: "Remote",
      posted: "9h ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB008",
      company: "QuantumSoft",
      jobTitle: "Full Stack Developer",
      description: "Handle both frontend & backend production apps.",
      location: "Hyderabad",
      jobType: "Full-time",
      workMode: "Hybrid",
      posted: "6h ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB009",
      company: "Skyline IT Services",
      jobTitle: "QA Tester",
      description: "Manual and automation testing for web apps.",
      location: "Bangalore",
      jobType: "Contract",
      workMode: "On-site",
      posted: "7h ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      id: "JOB010",
      company: "Digital Edge Corp",
      jobTitle: "Project Manager",
      description: "Manage software teams and client communication.",
      location: "Chennai",
      jobType: "Full-time",
      workMode: "Remote",
      posted: "4 days ago",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    }

  ];

}
