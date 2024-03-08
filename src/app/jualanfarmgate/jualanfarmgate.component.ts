import { Component, OnInit } from '@angular/core';
import { TransService } from '../services/trans.service';
import { transactionall } from '../models/transactionall';

@Component({
  selector: 'app-jualanfarmgate',
  templateUrl: './jualanfarmgate.component.html',
  styleUrls: ['./jualanfarmgate.component.css']
})
export class JualanfarmgateComponent implements OnInit {

  transactions: transactionall[] = [];
  filteredTrans: any[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  totalweight: number = 0;
  farmgateLateks: number = 0;
  farmgateSkrap: number = 0;
  totalfarmgateLateks: number = 0;
  totalfarmgateSkrap: number = 0;
  daerah: string = '';

  constructor(private transService: TransService) {
  }

  ngOnInit() {
    this.getAllTransactions();
  }

  getAllTransactions(): void {
    this.transService.getAllTransaction()
      .subscribe((resultArray) => {
        this.filteredTrans =
          this.transactions = resultArray,
          this.findtotal();
        //console.log(this.filteredTrans);
      },
        error => console.log("Error :: " + error)
      )
  }

  groupbyDistrict() {

  }

  findtotal() {
    this.totalLateks = 0;
    this.totalSekerap = 0;
    this.totalweight = 0;
    this.totalPrice = 0;
    this.farmgateLateks = 0;
    this.farmgateSkrap = 0;
    this.totalfarmgateLateks = 0;
    this.totalfarmgateSkrap = 0;
    this.daerah = '';


    this.filteredTrans.forEach(element => {
      this.totalLateks = this.totalLateks + (element.lateks * (element.drc / 100));
      this.totalSekerap = this.totalSekerap + (element.sekerap * (element.drc / 100));
      this.totalPrice = this.totalPrice + element.total;
      //newly add
      this.daerah = element.districtName;
      this.totalweight = this.totalLateks + this.totalSekerap;
      this.farmgateLateks = this.farmgateLateks + ((element.unitPriceLateks * (100 / element.drc)));
      //this.totalfarmgateLateks = (this.farmgateLateks/element.count);
      this.farmgateSkrap = this.farmgateSkrap + ((element.unitPriceSekerap * (100 / element.drc)));
    })
  }

  filter(query: string) {
    this.filteredTrans = (query) ?
      this.transactions.filter(p => p.nama.toLowerCase().includes(query.toLowerCase())) :
      this.transactions;
    this.findtotal();
  }

}
