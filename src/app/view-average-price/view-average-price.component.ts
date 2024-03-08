import { Component } from '@angular/core';
import { scheme } from '../models/scheme';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { TransService } from '../services/trans.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-average-price',
  templateUrl: './view-average-price.component.html',
  styleUrls: ['./view-average-price.component.css']
})
export class ViewAveragePriceComponent {
  schemes: scheme[] = [];
  dealerID: string = ''
  scheme: scheme = {} as scheme;


  constructor
    (private transService: TransService, public userService: UserService, private router: Router, private dialog: MatDialog,) { }

  ngOnInit() {

    this.transService.GetListPriceDRC().subscribe(data => {
      console.log(data)
      this.schemes = data;

    },
    )
  }


}
