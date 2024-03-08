import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { transaction } from '../models/transaction';
import { ActivatedRoute } from '@angular/router';
import { user } from '../models/user';

@Component({
  selector: 'app-print-transaction',
  templateUrl: './print-transaction.component.html',
  styleUrls: ['./print-transaction.component.css']
})
export class PrintTransactionComponent implements OnInit {

  transactions: transaction[] = [];
  filteredTrans: any[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  userInput: any
  userClaims: user = {} as user;
  isPrintButtonClicked = false;

  constructor
    (private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['filteredTrans']) {
        this.filteredTrans = JSON.parse(params['filteredTrans']);
        console.log(this.filteredTrans)
      }
    });
  }

  ngOnInit() {
    this.findtotal();
  }


  filter(query: string) {
    this.filteredTrans = (query) ?
      this.transactions.filter(p => p.nama.toLowerCase().includes(query.toLowerCase())) :
      this.transactions;
    this.findtotal();
    console.log(this.filteredTrans)
  }

  findtotal() {
    this.totalLateks = 0;
    this.totalSekerap = 0;
    this.totalPrice = 0;

    this.filteredTrans.forEach(element => {
      this.totalLateks = this.totalLateks + element.lateks;
      this.totalSekerap = this.totalSekerap + element.sekerap;
      this.totalPrice = this.totalPrice + element.total;
    })
  }


  @ViewChild('pdfContent', { static: true }) pdfContent: ElementRef | undefined;

  print() {
    this.isPrintButtonClicked = true;
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

}
