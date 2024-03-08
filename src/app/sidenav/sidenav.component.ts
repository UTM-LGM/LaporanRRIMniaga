import { Component, OnInit } from '@angular/core';
import { user } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  userClaims: any
  roleFelda: boolean = false

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.getUserClaims().subscribe(resUserClaim => {
      this.userClaims = resUserClaim
      console.log(this.userClaims)
      if (this.userClaims.DealerID == 5352 || this.userClaims.DealerID == 11) {
        this.roleFelda = true
      }
    })

  }

}
