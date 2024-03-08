import { Component, OnInit } from '@angular/core';
import { transfrac } from '../models/transfrac';
import { TransService } from '../services/trans.service';

@Component({
  selector: 'app-transfraction',
  templateUrl: './transfraction.component.html',
  styleUrls: ['./transfraction.component.css']
})
export class TransfractionComponent implements OnInit {

  transactions: transfrac[] = [];
  filteredTrans: any[] = [];
  totalweight: number = 0;
  totalPrice: number = 0;
  totalOwner: number = 0;
  totalTapper: number = 0;
  showDate: boolean = false
  showName: boolean = false
  showNoPatg: boolean = false
  searchBy: string[] = []
  fromDate: any;
  toDate: any;

  constructor(private transService: TransService) {
    this.transactions = [];
  }


  ngOnInit() {

    this.fromDate =  this.fromDate
    this.toDate = this.toDate

    this.searchBy = [
      // 'Tarikh Belian',
      // 'Nama Penjual',
      'No PatG',
    ];

  }


  findtotal() {
    this.totalweight = 0;
    this.totalPrice = 0;
    this.totalOwner = 0;
    this.totalTapper = 0;

    this.filteredTrans.forEach(element => {
      this.totalweight = this.totalweight + element.weight;
      this.totalOwner = this.totalOwner + element.totalOwner;
      this.totalTapper = this.totalTapper + element.totalTapper;
      this.totalPrice = this.totalPrice + element.total;
    })
  }

 filterNama(query: string) {
    this.filteredTrans = (query) ?
      this.transactions.filter(p => p.nama.toLowerCase().includes(query.toLowerCase())) :
      this.transactions;
    this.findtotal();
  }

  filterNoPatG(query: string) {
    this.filteredTrans = (query) ?
      this.transactions.filter(p => p.noPatG.toLowerCase().includes(query.toLowerCase())) :
      this.transactions;
    this.findtotal();
  }

  changeSearchBy(e: any) {
    e.target.value == "Tarikh Belian" ? this.showDate = true : this.showDate = false;
    e.target.value == "Nama Penjual" ? this.showName = true : this.showName = false;
    e.target.value == "No PatG" ? this.showNoPatg = true : this.showNoPatg = false;
  }

    
  filterDate() {
    if (this.fromDate && this.toDate) {
      this.transService.getTransFraction(this.fromDate, this.toDate)
        .subscribe((resultArray) => {
          this.filteredTrans = this.transactions = resultArray;
          this.findtotal();
        },
        error => console.log("Error :: " + error)
      );
    }
  }

}
