import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userIsLogedIn=false;


  constructor(private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isAuthenticated) this.userIsLogedIn=true
    this.authService.roleSetEvent.subscribe(
      next=>{
        if (next!==''){
          this.userIsLogedIn=true;
        } else{
          this.userIsLogedIn=false
        }
      }
    )
  }

  navigateToRoomsAdmin(){
    this.router.navigate(['admin','rooms'])
  }
  navigateToUsersAdmin(){
    this.router.navigate(['admin','users'])
  }
  navigateToCalendar(){
    this.router.navigate([''])
  }

  logout(){
    this.authService.logout();
    this.navigateToCalendar();
  }
}
