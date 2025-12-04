import { Component } from '@angular/core';

interface JobCard {
  company: string;
  jobTitle: string;
  jobId: string;
  description: string;
  location: string;
  jobType: string;
  mode: string;
  applicants: number;
  logo: string;
}

@Component({
  selector: 'app-job-applicants',
  standalone: true,
  templateUrl: './job-applicants.html',
  styleUrl: './job-applicants.css'
})
export class JobApplicants {

  jobList: JobCard[] = [

    {
      company: "TechNova Solutions",
      jobTitle: "Angular Developer",
      jobId: "JOB001",
      description: "Build dynamic Angular applications with modern UI.",
      location: "Hyderabad",
      jobType: "Full Time",
      mode: "Remote",
      applicants: 4,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "CloudBridge Pvt Ltd",
      jobTitle: "Node.js Backend Developer",
      jobId: "JOB002",
      description: "Develop backend services and REST APIs.",
      location: "Bangalore",
      jobType: "Full Time",
      mode: "On-site",
      applicants: 2,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "PixelCraft Studios",
      jobTitle: "UI/UX Designer",
      jobId: "JOB003",
      description: "Design clean web & mobile interfaces.",
      location: "Chennai",
      jobType: "Contract",
      mode: "Remote",
      applicants: 0,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "InnoSoft Labs",
      jobTitle: "React Developer",
      jobId: "JOB004",
      description: "Develop modern React 18 components.",
      location: "Delhi",
      jobType: "Full Time",
      mode: "Hybrid",
      applicants: 5,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "ByteWave Systems",
      jobTitle: "DevOps Engineer",
      jobId: "JOB005",
      description: "Manage CI/CD, Docker, Kubernetes deployments.",
      location: "Pune",
      jobType: "Full Time",
      mode: "Remote",
      applicants: 3,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "FutureTech AI",
      jobTitle: "Machine Learning Engineer",
      jobId: "JOB006",
      description: "Build ML models and data pipelines.",
      location: "Mumbai",
      jobType: "Full Time",
      mode: "On-site",
      applicants: 1,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "NextGen Web",
      jobTitle: "Frontend Developer",
      jobId: "JOB007",
      description: "HTML, CSS, JS, responsive UI development.",
      location: "Kolkata",
      jobType: "Part Time",
      mode: "Remote",
      applicants: 2,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "QuantumSoft",
      jobTitle: "Full Stack Developer",
      jobId: "JOB008",
      description: "Work on frontend & backend modules.",
      location: "Hyderabad",
      jobType: "Full Time",
      mode: "Hybrid",
      applicants: 7,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "Skyline IT Services",
      jobTitle: "QA Tester",
      jobId: "JOB009",
      description: "Perform manual & automation testing.",
      location: "Bangalore",
      jobType: "Contract",
      mode: "On-site",
      applicants: 0,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "Digital Edge Corp",
      jobTitle: "Project Manager",
      jobId: "JOB010",
      description: "Manage software teams and client communication.",
      location: "Chennai",
      jobType: "Full Time",
      mode: "Remote",
      applicants: 6,
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    }

  ];

}
