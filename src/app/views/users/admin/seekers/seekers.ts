import { Component } from '@angular/core';

interface Seeker {
  id: number;
  fullname: string;
  email: string;
  verification: string;
  role: string;
  status: string;
  lastLogin: string;
  lastLogout: string;
  logs: { login: string; logout: string }[];
}

@Component({
  selector: 'app-seekers',
  imports: [],
  templateUrl: './seekers.html',
  styleUrl: './seekers.css',
   standalone: true,
})
export class Seekers {

    selectedSeeker: Seeker | null = null;

  openLogsModal(seeker: Seeker) {
    this.selectedSeeker = seeker;
  }


seekers: Seeker[] = [

  {
    id: 1,
    fullname: "Siva Prasad Kurra",
    email: "user1@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Active",
    lastLogin: "10-11-2025, 12:00 PM",
    lastLogout: "10-11-2025, 17:00 PM",
    logs: [
      { login: "10-11-2025, 12:00 PM", logout: "10-11-2025, 17:00 PM" },
      { login: "09-11-2025, 11:00 AM", logout: "09-11-2025, 04:00 PM" },
      { login: "08-11-2025, 10:15 AM", logout: "08-11-2025, 01:30 PM" }
    ]
  },

  {
    id: 2,
    fullname: "John Doe",
    email: "user2@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Inactive",
    lastLogin: "11-11-2025, 10:00 AM",
    lastLogout: "-",
    logs: [
      { login: "11-11-2025, 10:00 AM", logout: "-" },
      { login: "10-11-2025, 09:45 AM", logout: "10-11-2025, 12:10 PM" },
      { login: "09-11-2025, 08:20 AM", logout: "09-11-2025, 11:00 AM" }
    ]
  },

  {
    id: 3,
    fullname: "Mary Smith",
    email: "user3@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Active",
    lastLogin: "09-11-2025, 02:00 PM",
    lastLogout: "09-11-2025, 16:00 PM",
    logs: [
      { login: "09-11-2025, 02:00 PM", logout: "09-11-2025, 16:00 PM" },
      { login: "08-11-2025, 11:30 AM", logout: "08-11-2025, 03:00 PM" },
      { login: "07-11-2025, 10:45 AM", logout: "07-11-2025, 01:00 PM" }
    ]
  },

  {
    id: 4,
    fullname: "Adam James",
    email: "user4@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Inactive",
    lastLogin: "08-11-2025, 01:00 PM",
    lastLogout: "-",
    logs: [
      { login: "08-11-2025, 01:00 PM", logout: "-" },
      { login: "07-11-2025, 09:00 AM", logout: "07-11-2025, 11:30 AM" },
      { login: "06-11-2025, 10:10 AM", logout: "06-11-2025, 12:20 PM" }
    ]
  },

  {
    id: 5,
    fullname: "Lisa Wayne",
    email: "user5@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Active",
    lastLogin: "12-11-2025, 11:00 AM",
    lastLogout: "12-11-2025, 13:00 PM",
    logs: [
      { login: "12-11-2025, 11:00 AM", logout: "12-11-2025, 13:00 PM" },
      { login: "11-11-2025, 02:10 PM", logout: "11-11-2025, 05:00 PM" },
      { login: "10-11-2025, 12:30 PM", logout: "10-11-2025, 03:40 PM" }
    ]
  },

  {
    id: 6,
    fullname: "Ravi Kumar",
    email: "user6@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Active",
    lastLogin: "10-11-2025, 09:30 AM",
    lastLogout: "10-11-2025, 12:00 PM",
    logs: [
      { login: "10-11-2025, 09:30 AM", logout: "10-11-2025, 12:00 PM" },
      { login: "09-11-2025, 01:20 PM", logout: "09-11-2025, 03:45 PM" },
      { login: "08-11-2025, 10:00 AM", logout: "08-11-2025, 12:30 PM" }
    ]
  },

  {
    id: 7,
    fullname: "Priya Sharma",
    email: "user7@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Inactive",
    lastLogin: "11-11-2025, 03:15 PM",
    lastLogout: "-",
    logs: [
      { login: "11-11-2025, 03:15 PM", logout: "-" },
      { login: "10-11-2025, 02:30 PM", logout: "10-11-2025, 05:00 PM" },
      { login: "09-11-2025, 12:00 PM", logout: "09-11-2025, 02:00 PM" }
    ]
  },

  {
    id: 8,
    fullname: "David Miller",
    email: "user8@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Active",
    lastLogin: "09-11-2025, 10:00 AM",
    lastLogout: "09-11-2025, 11:00 AM",
    logs: [
      { login: "09-11-2025, 10:00 AM", logout: "09-11-2025, 11:00 AM" },
      { login: "08-11-2025, 09:45 AM", logout: "08-11-2025, 12:10 PM" },
      { login: "07-11-2025, 08:30 AM", logout: "07-11-2025, 10:45 AM" }
    ]
  },

  {
    id: 9,
    fullname: "Sneha Reddy",
    email: "user9@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Active",
    lastLogin: "08-11-2025, 04:30 PM",
    lastLogout: "08-11-2025, 07:00 PM",
    logs: [
      { login: "08-11-2025, 04:30 PM", logout: "08-11-2025, 07:00 PM" },
      { login: "07-11-2025, 03:20 PM", logout: "07-11-2025, 05:10 PM" },
      { login: "06-11-2025, 01:15 PM", logout: "06-11-2025, 03:00 PM" }
    ]
  },

  {
    id: 10,
    fullname: "Michael Ray",
    email: "user10@gmail.com",
    verification: "Verified",
    role: "seeker",
    status: "Inactive",
    lastLogin: "07-11-2025, 09:00 AM",
    lastLogout: "-",
    logs: [
      { login: "07-11-2025, 09:00 AM", logout: "-" },
      { login: "06-11-2025, 10:00 AM", logout: "06-11-2025, 11:45 AM" },
      { login: "05-11-2025, 12:30 PM", logout: "05-11-2025, 02:00 PM" }
    ]
  }

];


}
