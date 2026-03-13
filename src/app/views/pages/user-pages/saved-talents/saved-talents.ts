import { Component } from '@angular/core';

@Component({
  selector: 'app-saved-talents',
  imports: [],
  templateUrl: './saved-talents.html',
  styleUrl: './saved-talents.css',
})
export class SavedTalents {
talents = [
{
  name:'Noah Thompson',
  role:'Product Designer',
  email:'noah@email.com',
  phone:'+1 234 567 890',
  location:'New York, USA',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=1'
},
{
  name:'Emma Watson',
  role:'UI Designer',
  email:'emma@email.com',
  phone:'+1 222 456 789',
  location:'London, UK',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=2'
},
{
  name:'Liam Carter',
  role:'Angular Developer',
  email:'liam@email.com',
  phone:'+1 333 456 111',
  location:'Toronto, Canada',
  status:'Inactive',
  avatar:'https://i.pravatar.cc/120?img=3'
},
{
  name:'Sophia Miller',
  role:'UX Researcher',
  email:'sophia@email.com',
  phone:'+1 444 567 222',
  location:'Sydney, Australia',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=4'
},
{
  name:'James Brown',
  role:'Frontend Developer',
  email:'james@email.com',
  phone:'+1 555 678 333',
  location:'San Francisco, USA',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=5'
},
{
  name:'Olivia Davis',
  role:'Backend Developer',
  email:'olivia@email.com',
  phone:'+1 666 789 444',
  location:'Berlin, Germany',
  status:'Inactive',
  avatar:'https://i.pravatar.cc/120?img=6'
},
{
  name:'William Scott',
  role:'React Developer',
  email:'william@email.com',
  phone:'+1 777 111 555',
  location:'Amsterdam, Netherlands',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=7'
},
{
  name:'Ava Johnson',
  role:'Mobile App Developer',
  email:'ava@email.com',
  phone:'+1 888 222 666',
  location:'Paris, France',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=8'
},
{
  name:'Benjamin Lee',
  role:'Full Stack Developer',
  email:'ben@email.com',
  phone:'+1 999 333 777',
  location:'Singapore',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=9'
},
{
  name:'Mia Wilson',
  role:'UI Engineer',
  email:'mia@email.com',
  phone:'+1 111 444 888',
  location:'Dubai, UAE',
  status:'Inactive',
  avatar:'https://i.pravatar.cc/120?img=10'
},
{
  name:'Lucas Anderson',
  role:'Software Engineer',
  email:'lucas@email.com',
  phone:'+1 222 555 999',
  location:'Austin, USA',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=11'
},
{
  name:'Charlotte White',
  role:'Product Manager',
  email:'charlotte@email.com',
  phone:'+1 333 666 000',
  location:'Tokyo, Japan',
  status:'Active',
  avatar:'https://i.pravatar.cc/120?img=12'
}
];
}
