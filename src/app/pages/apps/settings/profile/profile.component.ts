import { Component, OnInit } from '@angular/core';
import { UserClass } from 'src/app/classes/users.class';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  UpdateProfile = false;

  LOGGED_USER: UserClass = new UserClass()
  EDITED_PROFILE: UserClass = new UserClass()

  // LOADIN SPINNER FOR BUTTONS
  SHOW_LOADING_SPINNER: boolean = false;

  // CHECK IF DAAT CHANGED TO REMOVE THE DISABLED BUTTON
  DATA_CHANGED: boolean = false;
// LOGGED IN ADMIN'S ID
  ID : string

  constructor(private userService: UserService) {
    this.LOGGED_USER = new UserClass('', '', '', '', '', '');
    this.EDITED_PROFILE = new UserClass('', '', '', '', '', '');
  }

  ngOnInit(): void {
    this.ID = localStorage.getItem('admin_id') || ''
    this.GET_USER()
  }

  GET_USER(){
    this.userService.GET_USER_BY_USER_ID(this.ID).subscribe({
      next: (response: any) => { 
        this.LOGGED_USER = response.user;
        this.EDITED_PROFILE = response.user
      },
      error: (error) => { },
      complete: () => { }
    });
  }

  onInputChange(){
    if (JSON.stringify(this.LOGGED_USER) !== JSON.stringify(this.EDITED_PROFILE)) {
      this.DATA_CHANGED = true;
    }
    else {
      this.DATA_CHANGED = false;
    }
  }

  SAVE_UPDATE() {
    this.SHOW_LOADING_SPINNER = true;
    this.userService.UPDATE_USER(this.EDITED_PROFILE).subscribe({
      next: (response: any) => {  },
      error: (error) => {  },
      complete: () => {
        this.UpdateProfile = false;
        this.DATA_CHANGED = false;
        this.SHOW_LOADING_SPINNER = false
        }
    });
  }


    //SELECT USER TO UPDATE
    EDIT(): void {
      // HIDE THE ADD BUTTON AND DISPLAY THE UPDATE BTN INSTEAD
      this.UpdateProfile = true;
      // FILL THE OBJ WITH THE SELECTED USER TO UPDATE
      this.EDITED_PROFILE = { ...this.LOGGED_USER };
    }

      // CANCEL UPDATE
  CANCEL(): void {
    this.UpdateProfile = false;

    // EMPTY THE SELECTED USER TO UPDATE
    this.EDITED_PROFILE = { ...this.LOGGED_USER };

    this.DATA_CHANGED = false;
    this.SHOW_LOADING_SPINNER = false
  }

}
