import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { FormResetService } from 'src/app/form-reset.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit ,OnDestroy{
  
  @Output()
  dataChangeEvent=new EventEmitter();
  
  @Input()
  user: User;
  formUser: User;

  message: string;

  password: string;

  password2: string;

  nameIsValid = false;

  passwordAreValid = false;

  passwordMatch = false;

  userResetSubscription: Subscription;


  constructor(private dataService: DataService, private router: Router, private formResetService: FormResetService) { }
  ngOnDestroy(): void {
    this.userResetSubscription.unsubscribe();
  }

  ngOnInit() {
    this.initializeForm();
    this.userResetSubscription=this.formResetService.resetUserFormEvent.subscribe(
      user=> {
        this.user=user;
        this.initializeForm();
      }
    );
  }

  initializeForm(){
    this.formUser = Object.assign({}, this.user);
    this.checkNameIsValid();
    this.checkPasswordIsValid();
  }
  onSubmit() {
    this.message='Saving...';
    if (this.formUser.id == null) {
      this.dataService.addUser(this.formUser, this.password).subscribe(
        user =>{
        this.dataChangeEvent.emit();
          this.router.navigate(['admin', 'users'], { queryParams: { action: 'view', id: user.id } })
        },
        error=>{
          this.message='Something went wrong and the data wasn\'t saved. Please try again.'
        }
      )
    }
    else {
      this.dataService.updateUser(this.formUser).subscribe(
        user => {
          this.dataChangeEvent.emit();
          this.router.navigate(['admin', 'users'], { queryParams: { action: 'view', id: user.id } })
        },
        error=>{
          this.message='Something went wrong and the data wasn\'t saved. Please try again.'
        }
      )
    }
  }

  checkNameIsValid() {
    if (this.formUser.name) {
      this.nameIsValid = this.formUser.name.trim().length > 0;
    } else {
      this.nameIsValid = false;
    }
  }

  checkPasswordIsValid() {
    if (this.formUser.id == null) {
      this.passwordMatch = this.password === this.password2;
      if (this.password) {
        this.passwordAreValid = this.password.trim().length > 0;
      }
      else {
        this.passwordAreValid = false;
      }
    } else {
      this.passwordMatch = true;
      this.passwordAreValid = true;
    }
  }
}
