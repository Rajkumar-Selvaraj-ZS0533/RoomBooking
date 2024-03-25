import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { FormResetService } from 'src/app/form-reset.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: Array<User>;
  selectedUser: User;
  action: string;
  message='Loading user data.... Please wait';
  loadingData=true;
  isAdminUser=false

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService,
              private authService: AuthService) { }

  loadData(){
    this.dataService.getUsers().subscribe(
      next => {
        this.users = next;
        this.loadingData=false;
        this.processingParam();
      },
      error=>{
        this.message='An error occur please contact support';
      }
    );
  }
  processingParam(){
    this.route.queryParams.subscribe(
      (params) => {
        const id = params['id'];
        this.action = params['action'];
        if (id) {
          this.selectedUser = this.users.find( user => user.id === +id);
        }
      }
    );
  }
  ngOnInit(): void {
    this.loadData();
    if (this.authService.role==='ADMIN') {
      this.isAdminUser=true;
    }
    this.authService.roleSetEvent.subscribe(
      next=>{
        if (next==='ADMIN'){
          this.isAdminUser=true;
        } else{
          this.isAdminUser=false
        }
      }
    )
  }

  selectUser(id: number) {
    this.router.navigate(['admin','users'],{queryParams : {id, action : 'view'}});
  }

  addUser(){
    this.selectedUser=new User();
    this.router.navigate(['admin','users'],{queryParams : {action : 'add'}});
    this.formResetService.resetUserFormEvent.emit(this.selectedUser);
  }
}
