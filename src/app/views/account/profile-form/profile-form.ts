import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-form',
  imports: [],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm {

  step = 1;
  totalSteps = 8;

  nextStep(){
    if(this.step < this.totalSteps){
      this.step++;
    }
  }

  prevStep(){
    if(this.step > 1){
      this.step--;
    }
  }


  previewImage:any;

onFileSelected(event:any){

const file = event.target.files[0];

if(file){

const reader = new FileReader();

reader.onload = () =>{
this.previewImage = reader.result;
};

reader.readAsDataURL(file);

}

}

}
