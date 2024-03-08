import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { transaction } from '../models/transaction';
import { TransService } from '../services/trans.service';
import { interval } from 'rxjs';
import { Router } from '@angular/router';
import { user } from '../models/user';
import { UserService } from '../services/user.service';
import * as XLSX from 'xlsx';
import { transbyuserid } from '../models/transbyuserID';


@Component({
  selector: 'app-transbyuserdetail',
  templateUrl: './transbyuserdetail.component.html',
  styleUrls: ['./transbyuserdetail.component.css']
})
export class TransbyuserdetailComponent implements OnInit{

  transactions: transbyuserid[] = [];
  filteredTrans: any[] = [];
  transac: any[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  fromDate: any;
  toDate: any;
  users: user[] = []
  userInput : any

  constructor
    (private transService: TransService, 
      private router: Router, 
      public userService:UserService) { 
        this.transactions = [];
      }

  ngOnInit() {
    this.userService.GetUser()
    .subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.log("Error :: " + error);
      }
    );
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


  filterDate() {
    if (this.fromDate && this.toDate) {
      this.transService.getTransactionbyUser(this.fromDate, this.toDate, this.userInput)
        .subscribe((resultArray) => {
          this.filteredTrans = this.transactions = resultArray;
          this.findtotal();
        },
        error => console.log("Error :: " + error)
      );
    }
  }


  filterName() {
    
    this.filteredTrans = (this.userInput) ?
    this.transactions.filter(p => p.nama.toLowerCase().includes(this.userInput.toLowerCase())) :
    this.transactions;
    console.log(this.transactions)
     this.findtotal();
}

  displaySelected() {
    // this.filteredTrans = (this.userInput) ?
    // this.transactions.filter(p => p.nama.toLowerCase().includes(this.userInput.toLowerCase())) :
    // this.transactions;
    // console.log(this.transactions)
    //  this.findtotal();
    console.log(this.filteredTrans)
    this.router.navigate(['print'],{
      queryParams: { filteredTrans: JSON.stringify(this.filteredTrans) }
    });
  }

  exportToExcel(data: any[], fileName: string) {
    const filteredData = data.map((row) => ({

      // bil: row.bil,
      transDate: row.transDate,
      nama : row.nama,
      noPatG: row.noPatG,
      noResit: row.noResit,
      lateks: row.lateks,
      sekerap: row.sekerap,
      drc: row.drc,
      unitPrice: row.unitPrice,
      total: row.total

    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Save the Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  
  @ViewChild('pdfContent', { static: true }) pdfContent: ElementRef | undefined;


  print() {
    // this.isPrintButtonClicked = true;
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    // const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    location.reload();
  }
}

