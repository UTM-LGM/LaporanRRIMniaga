import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { user } from '../models/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  Url: string = environment.Url;
  readonly rootUrl = 'https://api.lgm.gov.my/loginAPI';

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(user: user) {
    user.username = user.UserName
    user.UserId = 0
    const body: user = {
      UserName: user.UserName,
      Password: user.Password,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      DealerID: user.DealerID,
      UserId: user.UserId,
      username: user.username,
      userId: user.userId


    }
    var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/api/User/Register', body, { headers: reqHeader });
  }

  GetUser(): Observable<user[]> {

    // let id = 11;
    let id = sessionStorage.getItem('dealerID');
    return this.http.get<user[]>(this.Url + '/api/eR1_lgm/GetUser/?dealerid=' + id)
  }


  userAuthentication(userName: string, password: string) {
    var data = "username=" + userName + "&password=" + password + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
  }

  // getUserClaims() {
  //   return this.http.get(this.rootUrl + '/api/GetUserClaims',{withCredentials:true});
  // }

  getUserClaims() {
    const userToken = sessionStorage.getItem('userToken');
    return this.http.get(this.rootUrl + '/api/GetUserClaims', { headers: { 'Authorization': `Bearer ${userToken}` } });
  }

  Logout() {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('dealerID');
    this.router.navigate(['/signIn']);
  }

  isLoggedIn() {

    return false;
  }

}
