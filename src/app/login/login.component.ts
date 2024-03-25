import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  message='';
  name: string;
  password: string;
  subscription: Subscription;

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription= this.authService.authenticationResultEvent.subscribe(
      next=>{
        if(next){
          // TODO: add navigation
                const url=this.route.snapshot.queryParams['requested'];
                this.router.navigateByUrl(url);
              } else{
                this.message= 'Username and password are not recognised - try again. '
              }
      }
    );
    this.authService.checkIfAlreadyAuthenticated();
  }

  onSubmit(){
    this.authService.authenticate(this.name,this.password)
  }

}
