import { EventEmitter, Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated=false;

  authenticationResultEvent= new EventEmitter<boolean>();

  role: string;
  roleSetEvent=new EventEmitter<string>();


  authenticate(name: string, password: string){
    this.dataservice.validateUser(name,password).subscribe(
      next=> {
        this.setUpRole();
        this.isAuthenticated=true;
        this.authenticationResultEvent.emit(true);
      }, error=>{
        this.isAuthenticated=false;
        this.authenticationResultEvent.emit(false);
      }
    );
  }

  setUpRole(){
    this.dataservice.getRole().subscribe(
      next=> {
        this.role=next.role;
        this.roleSetEvent.emit(next.role)
      }
    )
  }

  checkIfAlreadyAuthenticated(){
    this.dataservice.getRole().subscribe(
      next=>{
        console.log(next.role);
        
        if (next.role!=='') {
          
        this.role=next.role;
        this.roleSetEvent.emit(next.role);
          this.isAuthenticated=true;
          console.log(this.isAuthenticated);
          
          this.authenticationResultEvent.emit(true);
        }
      }
    )
  }

  logout(){
    this.dataservice.logout().subscribe();
    this.isAuthenticated=false;
    this.authenticationResultEvent.emit(false);
    this.roleSetEvent.emit('')
  }

  constructor(private dataservice: DataService) {
    this.checkIfAlreadyAuthenticated()
   }
}
