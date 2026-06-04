import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  role: string;
  lastActive?: string;
  type: 'direct' | 'channel';
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

export interface ChatMessage {
  id: string;
  senderId: 'me' | 'them';
  senderName: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: { name: string; size: string; type: string }[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);

  @ViewChild('messageStream') messageStream!: ElementRef<HTMLDivElement>;

  currentUser = this.authService.currentUser;
  searchQuery: string = '';
  activeTab: 'all' | 'direct' | 'channels' = 'all';
  newMessageText: string = '';
  selectedContact!: Contact;
  showChatMobile: boolean = false;

  contacts: Contact[] = [];

  // Messages map for each contact/channel
  messagesMap: { [key: string]: ChatMessage[] } = {
    '1': [
      { id: 'm1', senderId: 'them', senderName: 'Sarah Connor', text: 'Hey there! Just finished deploying the main structural elements for the financial dashboard.', time: '09:15 AM', status: 'read' },
      { id: 'm2', senderId: 'me', senderName: 'Client', text: 'That is wonderful news! How are the milestone pay buttons looking?', time: '09:20 AM', status: 'read' },
      { id: 'm3', senderId: 'them', senderName: 'Sarah Connor', text: 'They work flawlessly! I also hooked up the invoice downloads to trigger real receipt sheets.', time: '09:25 AM', status: 'read' },
      { id: 'm4', senderId: 'them', senderName: 'Sarah Connor', text: "Let's review the re-architecture blueprints tomorrow morning.", time: '10:42 AM', status: 'read' }
    ],
    '2': [
      { id: 'm5', senderId: 'them', senderName: 'T-800 Cyberdyne', text: 'System scan complete. Docker containers successfully built.', time: '02:00 PM', status: 'read' },
      { id: 'm6', senderId: 'me', senderName: 'Client', text: 'Excellent. Is the new pipeline deployment secure?', time: '02:05 PM', status: 'read' },
      { id: 'm7', senderId: 'them', senderName: 'T-800 Cyberdyne', text: 'Infrastructure migration finalized. Terminating all previous errors.', time: '02:10 PM', status: 'read' }
    ],
    '3': [
      { id: 'm8', senderId: 'them', senderName: 'John Connor', text: 'I completed the layout design updates for the main profile cards.', time: 'Monday', status: 'read' },
      { id: 'm9', senderId: 'them', senderName: 'John Connor', text: 'The new banking app mockups are looking extremely sleek.', time: 'Monday', status: 'read' }
    ],
    'dev-channel': [
      { id: 'm10', senderId: 'them', senderName: 'Sarah Connor', text: 'Sprint planning starts at 10 AM, team! Please update your task cards.', time: 'Friday', status: 'read' },
      { id: 'm11', senderId: 'them', senderName: 'T-800 Cyberdyne', text: 'Initializing deployment scripts now.', time: 'Friday', status: 'read' },
      { id: 'm12', senderId: 'them', senderName: 'John Connor', text: 'John uploaded a new design asset wireframe.png.', time: 'Friday', status: 'read', attachments: [{ name: 'wireframe.png', size: '2.4 MB', type: 'image' }] }
    ]
  };

  ngOnInit() {
    const role = this.currentUser()?.role?.toLowerCase() || '';
    if (role === 'freelancer') {
      this.contacts = [
        {
          id: '1',
          name: 'Sarah Connor',
          avatar: 'S',
          status: 'online',
          role: 'Client / Hiring Manager',
          lastActive: 'Active now',
          type: 'direct',
          unreadCount: 2,
          lastMessage: "Let's review the re-architecture blueprints tomorrow morning.",
          lastMessageTime: '10:42 AM'
        },
        {
          id: '2',
          name: 'T-800 Cyberdyne',
          avatar: 'T',
          status: 'away',
          role: 'Project Manager',
          lastActive: '5m ago',
          type: 'direct',
          unreadCount: 0,
          lastMessage: 'Infrastructure migration finalized. Terminating all previous errors.',
          lastMessageTime: 'Yesterday'
        },
        {
          id: '3',
          name: 'John Connor',
          avatar: 'J',
          status: 'online',
          role: 'Lead Architect',
          lastActive: 'Active now',
          type: 'direct',
          unreadCount: 0,
          lastMessage: 'The new banking app mockups are looking extremely sleek.',
          lastMessageTime: '2 days ago'
        },
        {
          id: 'dev-channel',
          name: '# core-development',
          avatar: '#',
          status: 'online',
          role: 'Public Channel',
          lastActive: '12 members',
          type: 'channel',
          unreadCount: 5,
          lastMessage: 'John uploaded a new design asset wireframe.png.',
          lastMessageTime: '3 days ago'
        }
      ];
    } else {
      this.contacts = [
        {
          id: '1',
          name: 'Sarah Connor',
          avatar: 'S',
          status: 'online',
          role: 'Lead Frontend Developer',
          lastActive: 'Active now',
          type: 'direct',
          unreadCount: 2,
          lastMessage: "Let's review the re-architecture blueprints tomorrow morning.",
          lastMessageTime: '10:42 AM'
        },
        {
          id: '2',
          name: 'T-800 Cyberdyne',
          avatar: 'T',
          status: 'away',
          role: 'DevOps Architect',
          lastActive: '5m ago',
          type: 'direct',
          unreadCount: 0,
          lastMessage: 'Infrastructure migration finalized. Terminating all previous errors.',
          lastMessageTime: 'Yesterday'
        },
        {
          id: '3',
          name: 'John Connor',
          avatar: 'J',
          status: 'online',
          role: 'Mobile UI/UX Specialist',
          lastActive: 'Active now',
          type: 'direct',
          unreadCount: 0,
          lastMessage: 'The new banking app mockups are looking extremely sleek.',
          lastMessageTime: '2 days ago'
        },
        {
          id: 'dev-channel',
          name: '# core-development',
          avatar: '#',
          status: 'online',
          role: 'Public Channel',
          lastActive: '12 members',
          type: 'channel',
          unreadCount: 5,
          lastMessage: 'John uploaded a new design asset wireframe.png.',
          lastMessageTime: '3 days ago'
        }
      ];
    }

    // Select the first contact by default
    if (this.contacts.length > 0) {
      this.selectedContact = this.contacts[0];
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  get currentUserFullName(): string {
    return this.currentUser()?.fullName || 'Me';
  }

  get filteredContacts(): Contact[] {
    return this.contacts.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                           c.lastMessage.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesTab = this.activeTab === 'all' || 
                         (this.activeTab === 'direct' && c.type === 'direct') ||
                         (this.activeTab === 'channels' && c.type === 'channel');
      return matchesSearch && matchesTab;
    });
  }

  get currentMessages(): ChatMessage[] {
    return this.messagesMap[this.selectedContact?.id] || [];
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
    contact.unreadCount = 0; // Clear unread when clicked
    this.showChatMobile = true;
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.newMessageText.trim() || !this.selectedContact) return;

    const currentContactId = this.selectedContact.id;
    const sentText = this.newMessageText;

    const userMsg: ChatMessage = {
      id: 'sent-' + Date.now(),
      senderId: 'me',
      senderName: this.currentUserFullName,
      text: sentText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Append user message
    if (!this.messagesMap[currentContactId]) {
      this.messagesMap[currentContactId] = [];
    }
    this.messagesMap[currentContactId].push(userMsg);
    
    // Update contact last message
    this.selectedContact.lastMessage = sentText;
    this.selectedContact.lastMessageTime = userMsg.time;

    this.newMessageText = '';
    this.scrollToBottom();

    // Trigger mock reply after 1.5 seconds
    setTimeout(() => {
      userMsg.status = 'read';
      this.triggerMockReply(currentContactId, sentText);
    }, 1500);
  }

  triggerMockReply(contactId: string, query: string) {
    // Only reply if the user is still viewing the same contact
    let replyText = 'Thanks for the message! I am currently working on our milestones and will get back to you shortly.';
    let senderName = this.selectedContact?.name || 'User';

    if (contactId === '1') {
      if (query.toLowerCase().includes('re-architecture') || query.toLowerCase().includes('blueprint') || query.toLowerCase().includes('tomorrow')) {
        replyText = 'Excellent! I will have the diagram sheets and schema patterns ready. See you at 9:00 AM sharp!';
      } else {
        replyText = 'I am testing the payment gateways now. Let me know if you need any adjustments on the dashboard layout!';
      }
    } else if (contactId === '2') {
      replyText = 'Affirmative. Pipeline protocols secured. Processing all future system requirements.';
    } else if (contactId === '3') {
      replyText = 'Sounds perfect! I am finalizing the color palettes and responsive tokens now.';
    } else if (contactId === 'dev-channel') {
      senderName = 'Sarah Connor';
      replyText = "Got it! I've logged this in our tracking dashboard. Let's sync up in tomorrow's standup.";
    }

    const replyMsg: ChatMessage = {
      id: 'reply-' + Date.now(),
      senderId: 'them',
      senderName: senderName,
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    if (!this.messagesMap[contactId]) {
      this.messagesMap[contactId] = [];
    }
    this.messagesMap[contactId].push(replyMsg);
    
    // Update contact last message
    const contactObj = this.contacts.find(c => c.id === contactId);
    if (contactObj) {
      contactObj.lastMessage = replyText;
      contactObj.lastMessageTime = replyMsg.time;
      if (this.selectedContact?.id !== contactId) {
        contactObj.unreadCount++;
      }
    }
    this.scrollToBottom();
  }

  addAttachment() {
    if (!this.selectedContact) return;
    const currentContactId = this.selectedContact.id;
    const attachMsg: ChatMessage = {
      id: 'attach-' + Date.now(),
      senderId: 'me',
      senderName: this.currentUserFullName,
      text: 'Shared a new contract deliverable document:',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      attachments: [{ name: 'Project_Escrow_Agreement.pdf', size: '1.8 MB', type: 'document' }]
    };

    if (!this.messagesMap[currentContactId]) {
      this.messagesMap[currentContactId] = [];
    }
    this.messagesMap[currentContactId].push(attachMsg);
    this.selectedContact.lastMessage = 'Shared an attachment: Project_Escrow_Agreement.pdf';
    this.selectedContact.lastMessageTime = attachMsg.time;
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.messageStream && this.messageStream.nativeElement) {
          this.messageStream.nativeElement.scrollTop = this.messageStream.nativeElement.scrollHeight;
        }
      } catch (err) {
        console.error('Scroll error:', err);
      }
    }, 50);
  }

  getDashboardRoute(): string {
    const role = this.currentUser()?.role?.toLowerCase() || '';
    if (role === 'client') {
      return '/user/client-dashboard';
    } else if (role === 'freelancer') {
      return '/user/my-dashboard';
    } else if (role === 'admin') {
      return '/user/admin/dashboard';
    }
    return '/user/client-dashboard';
  }
}
