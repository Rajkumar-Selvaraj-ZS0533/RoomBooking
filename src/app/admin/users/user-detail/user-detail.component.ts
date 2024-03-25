import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input()
  user: User;

  @Output()
  dataChangeEvent=new EventEmitter();

  message='';

  isAdminUser=false;
  
  constructor(private dataService: DataService, 
    private router:Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.setUpRole();
    if (this.authService.role==='ADMIN') {
      this.isAdminUser=true;
    }this.authService.roleSetEvent.subscribe(
      next=>{
        if (next==='ADMIN'){
          this.isAdminUser=true;
        } else{
          this.isAdminUser=false
        }
      }
    )

  }

  editUser(){
    console.log(this.user.id);
    
    this.router.navigate(['admin','users'],{queryParams: {action:'edit', id: +this.user.id}});    
  }
  
  deleteUser(){
    const result=confirm('Are you sure you wish to delete this user?');
    if(result){  
      this.message='Deleting User...';
      this.dataService.deleteUser(this.user.id).subscribe(
        next=>{
          this.dataChangeEvent.emit();
          this.router.navigate(['admin','users']);
        },
        error=>this.message='Sorry this user cannot be deleted at this time!'
      )
    }
  }

  resetPassword(){
    this.message='please wait...';
    this.dataService.resetUserPassword(this.user.id).subscribe(
      next=>this.message='Password is reset',
      error=> this.message='Sorry, Something went wrong'
    );
  }

}
