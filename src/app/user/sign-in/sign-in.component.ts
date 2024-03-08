import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  isLoginError: boolean = false;


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  OnSubmit(userName: string, password: string) {
    this.userService.userAuthentication(userName, password).subscribe(
      (data: any) => {
        sessionStorage.setItem('userToken', data.access_token);
        // Navigate to the home page
        this.router.navigateByUrl('home').then(() => {
          // Reload the page once navigation is complete
          window.location.reload();
        });
      },
      (err: HttpErrorResponse) => {
        this.isLoginError = true;
      }
    );
  }


  // OnSubmit(userName: string, password: string) {
  //   this.userService.userAuthentication(userName, password).subscribe(
  //     (data: any) => {
  //       sessionStorage.setItem('userToken', data.access_token);
  //       // sessionStorage.setItem('dealerId', '11');
  //       this.router.navigateByUrl('/home');
  //       window.location.reload(); 
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.isLoginError = true;
  //     }
  //   );
  // }


}
