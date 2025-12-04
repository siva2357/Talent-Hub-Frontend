import { Component } from '@angular/core';

interface Interview {
  company: string;
  jobTitle: string;
  jobId: string;
  candidate: string;
  date: string;
  time: string;
  mode: string;
  status: string;
  logo: string;
}

@Component({
  selector: 'app-interviews',
  standalone: true,
  templateUrl: './interviews.html',
  styleUrl: './interviews.css'
})
export class Interviews {

  interviewList: Interview[] = [

    {
      company: "TechNova Solutions",
      jobTitle: "Angular Developer",
      jobId: "JOB001",
      candidate: "Siva Prasad",
      date: "12 Nov 2025",
      time: "10:00 AM",
      mode: "Remote",
      status: "Completed",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "CloudBridge Pvt Ltd",
      jobTitle: "Node.js Backend Engineer",
      jobId: "JOB002",
      candidate: "John Doe",
      date: "11 Nov 2025",
      time: "03:00 PM",
      mode: "On-site",
      status: "Scheduled",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "PixelCraft Studios",
      jobTitle: "UI/UX Designer",
      jobId: "JOB003",
      candidate: "Mary Smith",
      date: "13 Nov 2025",
      time: "01:00 PM",
      mode: "Remote",
      status: "Scheduled",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "ByteWave Systems",
      jobTitle: "DevOps Engineer",
      jobId: "JOB004",
      candidate: "Ravi Kumar",
      date: "10 Nov 2025",
      time: "11:00 AM",
      mode: "Remote",
      status: "Completed",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "MetaLogic Softwares",
      jobTitle: "Full Stack Developer",
      jobId: "JOB005",
      candidate: "Priya Sharma",
      date: "14 Nov 2025",
      time: "09:30 AM",
      mode: "On-site",
      status: "Not Completed",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "NeoMatrix Technologies",
      jobTitle: "React Developer",
      jobId: "JOB006",
      candidate: "David Miller",
      date: "15 Nov 2025",
      time: "02:00 PM",
      mode: "Remote",
      status: "Scheduled",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "Skyline IT Hub",
      jobTitle: "QA Automation Engineer",
      jobId: "JOB007",
      candidate: "Sneha Reddy",
      date: "09 Nov 2025",
      time: "12:00 PM",
      mode: "On-site",
      status: "Completed",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "Vortex Digital",
      jobTitle: "Graphic Designer",
      jobId: "JOB008",
      candidate: "Michael Ray",
      date: "16 Nov 2025",
      time: "11:30 AM",
      mode: "Remote",
      status: "Not Completed",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "DataSphere Analytics",
      jobTitle: "Data Analyst",
      jobId: "JOB009",
      candidate: "Ananya Gupta",
      date: "13 Nov 2025",
      time: "04:30 PM",
      mode: "Remote",
      status: "Scheduled",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    },

    {
      company: "QuantumByte Pvt Ltd",
      jobTitle: "Cybersecurity Engineer",
      jobId: "JOB010",
      candidate: "Arjun Verma",
      date: "17 Nov 2025",
      time: "10:45 AM",
      mode: "On-site",
      status: "Completed",
      logo: "https://res.cloudinary.com/dpp8aspqs/image/upload/v1750695578/logo_1_lcthi4.png"
    }

  ];

}
