import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { user } from '../models/user';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      transition(':enter', [
        animate('1s ease-out', keyframes([
          style({ opacity: 0, transform: 'scale(0.8)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1.2)', offset: 0.7 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
      ]),
      transition(':leave', [
        animate('1s ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ]),
    ]),
    trigger('textColorChange', [
      state('initial', style({ color: 'blue' })),
      state('final', style({ color: 'red' })),
      transition('initial <=> final', animate('1s')),
    ]),
  ]

})
export class HomeComponent {
  userClaims: user = {} as user;
  today = new Date();
  pipe = new DatePipe('en-US');

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.getUserClaims().subscribe((data: any) => {
      this.userClaims = data;
      sessionStorage.setItem('dealerID', data.DealerID);
    });
  }


}
