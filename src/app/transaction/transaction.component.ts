import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { transaction } from '../models/transaction';
import { TransService } from '../services/trans.service';
import { Router } from '@angular/router';
import { user } from '../models/user';
import { UserService } from '../services/user.service';
import * as XLSX from 'xlsx';
import { stock } from '../models/stock';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  transactions: transaction[] = [];
  filteredTrans: any[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  userInput: any
  userClaims: user = {} as user;
  isPrintButtonClicked = false; // Add this variable
  stocks: stock = {} as stock;

  constructor
    (private transService: TransService, private router: Router, public userService: UserService) { }

  ngOnInit() {

    this.getPosts();
    this.getStock();
  }


  getStock(): void {
    this.transService.getStockCurrentMonth()
      .subscribe((stok) => {
        this.stocks = stok
      },
        error => console.log("Error :: " + error)
      )
  }

  getPosts(): void {
    this.transService.getTransactionCurrentMonth()
      .subscribe((resultArray) => {
        this.filteredTrans =
          this.transactions = resultArray,
          this.findtotal();
        console.log(this.filteredTrans);
      },
        error => console.log("Error :: " + error)
      )
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


  displaySelected() {
    // this.filteredTrans = (this.userInput) ?
    // this.transactions.filter(p => p.nama.toLowerCase().includes(this.userInput.toLowerCase())) :
    // this.transactions;
    // console.log(this.transactions)
    //  this.findtotal();
    const queryParams = { filteredTrans: JSON.stringify(this.filteredTrans) };
    const navigationExtras = {
      skipLocationChange: true,
      queryParams,
    };

    this.router.navigate(['printTransaction'], navigationExtras);
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  exportToExcel(data: any[], stocks: any, fileName: string) {

    let bilCounter = 1;
    const filteredData = data.map((row) => ({
      Bil: bilCounter++,
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

    // Calculate and add the totals
    const totalRow = {
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

    filteredData.push(totalRow);

    // Create a new worksheet for stock data
    const stockData = [
      ['Bulan/Tahun', 'Stok Bulan Lepas', 'Belian Semasa', 'Jualan', 'Susutan', 'Baki Getah dibawa ke bulan hadapan'],
      [`${stocks?.Month}/${stocks?.Year}`, stocks?.CfStock, stocks?.CurrentPurchase, stocks?.TotalSold, stocks?.Decrease, stocks?.BfStock],
    ];

    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Convert the filtered data to a worksheet
    const filteredWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, filteredWs, 'Belian Bulanan');

    // Convert the stock data to a worksheet
    const stockWs: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(stockData);
    XLSX.utils.book_append_sheet(wb, stockWs, 'Maklumat Stok');


    // Save the Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }


  @ViewChild('pdfContent', { static: true }) pdfContent: ElementRef | undefined;


  print() {
    this.isPrintButtonClicked = true;
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    // const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    location.reload();
  }
}
