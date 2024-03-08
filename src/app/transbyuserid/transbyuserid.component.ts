import { Component, OnInit } from '@angular/core';
import { transbyuserid } from '../models/transbyuserID';
import { TransService } from '../services/trans.service';
import { UserService } from '../services/user.service';
import { user } from '../models/user';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { stock } from '../models/stock';

@Component({
  selector: 'app-transbyuserid',
  templateUrl: './transbyuserid.component.html',
  styleUrls: ['./transbyuserid.component.css']
})
export class TransbyuseridComponent implements OnInit {

  transactions: transbyuserid[] = [];
  transactionsUser: transbyuserid[] = [];
  filteredTrans: any[] = [];
  filteredTransUser: any[] = [];
  transac: any[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  fromDate: any;
  toDate: any;
  users: user[] = []
  userInput: any
  username: any
  stocks: stock = {} as stock;

  constructor(
    private transService: TransService,
    private userService: UserService,
    private router: Router
  ) {
    this.transactions = [];
  }

  ngOnInit() {
    this.userService.GetUser()
      .subscribe(
        (data) => {
          this.users = data;
          console.log(this.users)
        },
        (error) => {
          console.log("Error :: " + error);
        }
      );

    this.findtotal()
  }

  findtotal() {
    this.totalPrice = 0;
    this.transactions.forEach(element => {
      this.totalPrice = this.totalPrice + element.total;

    })
  }

  findtotalUser() {
    this.totalSekerap = 0;
    this.totalLateks = 0;
    this.totalPrice = 0;
    this.transactionsUser.forEach(element => {
      this.totalPrice = this.totalPrice + element.total;
      this.totalLateks = this.totalLateks + element.lateks;
      this.totalSekerap = this.totalSekerap + element.sekerap;
    })
  }



  filterDate() {
    if (this.fromDate && this.toDate) {
      this.transService.getTransactionbyDate(this.fromDate, this.toDate)
        .subscribe((resultArray) => {
          this.filteredTrans = this.transactions = resultArray;
          this.findtotal();
        },
          error => console.log("Error :: " + error)
        );
    }
  }

  // filterDate() {
  //   if (this.fromDate && this.toDate) {
  //     const firstRequest = this.transService.getTransactionbyDate(this.fromDate, this.toDate);
  //     const secondRequest = this.transService.getTransactionbyUser(this.fromDate, this.toDate, this.userInput);

  //     forkJoin([firstRequest, secondRequest]).subscribe(
  //       ([resultArray1, resultArray2]) => {
  //         this.transactions = resultArray1;
  //         this.filteredTrans = resultArray2;
  //         this.findtotal();
  //       },
  //       error => console.log("Error :: " + error)
  //     );
  //   }
  // }

  filterName() {
    this.transService.getTransactionbyUser(this.fromDate, this.toDate, this.userInput)
      .subscribe((resultArray) => {
        this.filteredTransUser = this.transactionsUser = resultArray;
        console.log(resultArray)
        this.findtotalUser();
      },
        error => console.log("Error :: " + error)
      );

    this.username = this.users.find(p => p.userId == this.userInput)?.username

    this.filteredTrans = (this.username) ?
      this.transactions.filter(p => p.nama.toLowerCase().includes(this.username.toLowerCase())) :
      this.transactions;
    this.findtotal();
    console.log(this.filteredTrans)

    //   this.transService.getTransactionbyDate(this.fromDate, this.toDate)
    //   .subscribe((resultArray) => {
    //     this.filteredTrans = this.transactions = resultArray;
    //     console.log(resultArray)
    //     this.findtotal();
    //   },
    //   error => console.log("Error :: " + error)
    // );

  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  exportToExcel(data: any[], transaction: any[], fileName: string) {

    let bilCounter = 1;
    const filteredData = data.map((row) => ({
      Bil: bilCounter++,
      Tarikh: this.formatDate(new Date(row.tarikh)),
      NamaPengguna: row.nama,
      Jumlah: row.total,
    }));

    // Calculate and add the totals
    const totalRow = {
      Bil: 0, // Use an empty string for the total row in the filteredData
      Tarikh: 'Total:',
      NamaPengguna: '', // Placeholder value for NamaPenjual
      Jumlah: this.totalPrice,
    };

    filteredData.push(totalRow);

    let bilCounters = 1;
    const transactionData = transaction.map((row) => ({
      Bil: bilCounters++,
      Tarikh: this.formatDate(new Date(row.transDate)),
      NamaPenjual: row.nama,
      NoPatG: row.noPatG,
      NoResit: row.noResit,
      Lateks: row.lateks,
      Sekerap: row.sekerap,
      DRC: row.drc,
      Harga: row.unitPrice,
      Jumlah: row.total,
    }));

    const totalTransactionRow = {
      Bil: 0,
      Tarikh: 'Total:',
      NamaPenjual: '', // Placeholder value for NamaPenjual
      NoPatG: '',      // Placeholder value for NoPatG
      NoResit: '',     // Placeholder value for NoResit
      Lateks: this.totalLateks,
      Sekerap: this.totalSekerap,
      DRC: '',          // Placeholder value for DRC
      Harga: '',        // Placeholder value for Harga
      Jumlah: this.totalPrice,

    };

    transactionData.push(totalTransactionRow);

    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Convert the stock data to a worksheet
    const transactionWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(wb, transactionWs, 'Maklumat Transaksi');

    // Convert the filtered data to a worksheet
    const filteredWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, filteredWs, 'Belian Bulanan');

    // Save the Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }


  displaySelected() {
    const queryParams = { filteredTrans: JSON.stringify(this.filteredTrans) };
    const navigationExtras = {
      skipLocationChange: true,
      queryParams,
    };

    this.router.navigate(['printTransaction'], navigationExtras);
  }
}
