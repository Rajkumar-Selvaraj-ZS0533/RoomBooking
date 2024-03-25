import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { FormResetService } from 'src/app/form-reset.service';
import { Room } from 'src/app/model/Room';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: Array<Room>;
  selectedRoom: Room;
  action: string;
  loadingData = true;
  message = 'Please wait.... getting data of room';
  reloadAttempts = 0;
  isAdminUser=false;

  constructor(private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private formResetService: FormResetService,
    private authService: AuthService) { }

  loadData() {
    this.dataService.getRooms().subscribe(
      (next) => {
        this.rooms = next
        this.loadingData = false;
        this.processUrlParam();
      },
      error => {
        if (error.status === 402) {
          this.message = 'Sorry You need to make payment before using the application';
        } else {
          if (this.reloadAttempts < 10) {
            this.reloadAttempts++;
            this.message = 'sorry something went wrong. trying again.... ';
            this.loadData();
          } else {
            this.message = 'sorry something went wrong please contact support ';
          }
        }
      }

    );
  }

  processUrlParam() {
    this.route.queryParams.subscribe(
      (param) => {
        this.action = null;
        const id = param['id'];
        if (id) {
          this.selectedRoom = this.rooms.find((room) => room.id === +id);
          this.action = param['action'];
        }
        if (param['action'] === 'add') {
          this.selectedRoom = new Room();
          this.action = 'edit';
          this.formResetService.resetRoomFormEvent.emit(this.selectedRoom);
        }
      }
    );
  }
  ngOnInit() {
    this.loadData();
    if(this.authService.role==='ADMIN'){
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

  setRoom(id: number) {
    this.router.navigate(['admin', 'rooms'], { queryParams: { id: id, action: 'view' } });
  }

  addRoom() {
    this.router.navigate(['admin', 'rooms'], { queryParams: { action: 'add' } });
  }
}
