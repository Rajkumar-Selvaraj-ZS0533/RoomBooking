import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Booking } from './model/Booking';
import { Layout, LayoutCapacity, Room } from './model/Room';
import { User } from './model/User';
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {
   getRooms(): Observable<Array<Room>>{
    return this.http.get<Array<Room>>(environment.restUrl+'/api/rooms',{ withCredentials:true})
    .pipe(
      map(
        data=> {
          const rooms =new Array<Room>();
          for (const room of data) {
            rooms.push(Room.fromHttp(room));
          }
          return rooms;
        }
      )
    )
  }

  getUsers(): Observable<Array<User>>{
    return this.http.get<Array<User>>(environment.restUrl+'/api/users',{ withCredentials:true})
    .pipe(
      map(data=> {
        const users=new Array<User>();
        for (const user of data) {
          users.push(User.fromHttp(user));
        }        
        return users;
      })
    );
    // return of(null);
  }

  updateUser(user: User): Observable<User>{
    return this.http.put<User>(environment.restUrl+'/api/users',user,{ withCredentials:true});
  }

  addUser(newUser: User, password: string): Observable<User>{
    const fullUser={id: newUser.id, name: newUser.name, password: password}
    return this.http.post<User>(environment.restUrl+'/api/users',fullUser,{ withCredentials:true});
  }

  deleteUser(userId: number): Observable<any>{
    return this.http.delete(environment.restUrl+'/api/users/'+userId,{ withCredentials:true});
  }

  resetUserPassword(userId: number): Observable<any>{
    return this.http.get(environment.restUrl+'/api/users/resetPassword/'+userId,{ withCredentials:true});
  }

  getCorrectedRoom(room: Room):Room{
    const correctedRoom={id: room.id, name: room.name, location: room.location, capacities: []}
    for (const lc of room.capacities) {
      let correctLayout;
      for(let member in Layout){
        if(Layout[member]===lc.layout){
          correctLayout=member;
        }
      }
      const correctedLayout={layout:correctLayout, capacity: lc.capacity}
      correctedRoom.capacities.push(correctedLayout);
    }
    return correctedRoom;
  }

  updateRoom(room: Room): Observable<Room>{
    return this.http.put<Room>(environment.restUrl+'/api/rooms',this.getCorrectedRoom(room),{withCredentials:true});
  }

  addRoom(newroom: Room): Observable<Room>{
    return this.http.post<Room>(environment.restUrl+'/api/rooms',this.getCorrectedRoom(newroom),{ withCredentials:true});
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(environment.restUrl+'/api/rooms/'+id,{ withCredentials:true});
  }

  getBookings(date:string): Observable<Array<Booking>>{
    return this.http.get<Array<Booking>>(environment.restUrl+"/api/bookings/"+date).pipe(
      map(data=>{
        const bookings=new Array<Booking>();
        for (const booking of data) {
          bookings.push(Booking.fromHttp(booking));
        }
        return bookings;
      })
    );
  }

  getBooking(id: number): Observable<Booking>{
    return this.http.get<Booking>(environment.restUrl+'/api/bookings?id='+id,{ withCredentials:true})
    .pipe(
      map(data=> Booking.fromHttp(data))
    );
  }

  private getCorrectedBooking(booking: Booking) {

    let correctLayout;
    for (let member in Layout) {
      if (Layout[member] === booking.layout) {
        correctLayout = member;
      }
    }

    if (booking.startTime.length < 8) {
      booking.startTime = booking.startTime + ':00';
    }

    if (booking.endTime.length < 8) {
      booking.endTime = booking.endTime + ':00';
    }

    const correctedBooking = {id : booking.id,  room: this.getCorrectedRoom(booking.room), user: booking.user,
      title: booking.title, date: booking.date, startTime: booking.startTime, endTime: booking.endTime,
      participants: booking.participants, layout: correctLayout};

    return correctedBooking;
  }

  saveBooking(booking: Booking): Observable<Booking>{
    return this.http.put<Booking>(environment.restUrl+'/api/bookings',this.getCorrectedBooking(booking),{ withCredentials:true});
  }


  addBooking(newBooking: Booking): Observable<Booking>{
    return this.http.post<Booking>(environment.restUrl+'/api/bookings',this.getCorrectedBooking(newBooking),{ withCredentials:true});
  }

  deleteBooking(id: number): Observable<any>{
    return this.http.delete(environment.restUrl+'/api/bookings/'+id,{ withCredentials:true});
  }

  validateUser(name: string, password: string): Observable<{result:string}>{
    const authData=btoa(`${name}:${password}`)
    const user={username: name, password:password}
    return this.http.post<{result:string}>(environment.restUrl+'/api/basicAuth/validate',user, {withCredentials : true})
  }

  getRole(): Observable<{role: string}>{
    return this.http.get<{role: string}>(environment.restUrl+'/api/users/currentUserRole', {withCredentials:true})
  }

  logout(): Observable<string>{
    return this.http.get<string>(environment.restUrl+'/api/users/logout', {withCredentials:true})
  }

  constructor(private http: HttpClient) {
    
    console.log(environment.restUrl);
  }
}
