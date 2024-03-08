import { Component } from '@angular/core';
import { TransService } from '../services/trans.service';
import { ActivatedRoute, Router } from '@angular/router';
import { transaction } from '../models/transaction';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-purchasebyname',
  templateUrl: './purchasebyname.component.html',
  styleUrls: ['./purchasebyname.component.css']
})
export class PurchasebynameComponent {

  filteredTrans: any[] = [];
  transactions: transaction[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  showDate: boolean = false
  showName: boolean = false
  showNoPatg: boolean = false
  searchBy: string[] = []
  fromDate: any;
  toDate: any;
  nextDate = new Date()
  uniqueSellerNames: any[] = [];
  selectedSellerName: any
  selectedNoPatG: any
  noPatG: any[] = [];

  constructor(private transService: TransService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {

    this.transService.getTransactionDateRange(this.fromDate, this.toDate)
      .subscribe((resultArray) => {
        console.log(resultArray)

        const uniqueSellerNames = Array.from(new Set(resultArray.map(item => item.nama)));
        console.log(uniqueSellerNames)
        // Order the unique seller names alphabetically in a case-insensitive manner
        const orderedUniqueSellerNames = uniqueSellerNames.sort();

        // console.log(orderedUniqueSellerNames)
        this.uniqueSellerNames = orderedUniqueSellerNames;

        const noPatG = Array.from(new Set(resultArray.map(item => item.noPatG)));
        this.noPatG = noPatG.sort();


        console.log(uniqueSellerNames)
        this.filteredTrans =
          this.transactions = resultArray,
          this.findtotal();
      },
        error => console.log("Error :: " + error)
      )

    this.fromDate = this.fromDate
    this.toDate = this.toDate

    this.searchBy = [
      'Nama Penjual',
      'No PatG',
    ];



  }
  dateChange() {
    this.transService.getTransactionDateRange(this.fromDate, this.toDate)
      .subscribe((resultArray) => {
        console.log(resultArray)

        const uniqueSellerNames = Array.from(new Set(resultArray.map(item => item.nama)));
        console.log(uniqueSellerNames)
        // Order the unique seller names alphabetically in a case-insensitive manner
        const orderedUniqueSellerNames = uniqueSellerNames.sort();

        console.log(orderedUniqueSellerNames)
        this.uniqueSellerNames = orderedUniqueSellerNames;
        // this.uniqueSellerNames = uniqueSellerNames;

        const noPatG = Array.from(new Set(resultArray.map(item => item.noPatG)));
        this.noPatG = noPatG.sort();

        console.log(uniqueSellerNames)
        // this.filteredTrans =
        //   this.transactions = resultArray,
        //   this.findtotal();
      },
        error => console.log("Error :: " + error)
      )
  }

  searchSample(query: string) {
    if (this.fromDate && this.toDate) {
      this.transService.getTransactionDateRange(this.fromDate, this.toDate)
        .subscribe((resultArray) => {
          this.filteredTrans = this.transactions = resultArray;
          this.findtotal();
        },
          error => console.log("Error :: " + error)
        );
    }
    this.filteredTrans = (query) ?
      this.transactions.filter(p => p.nama.toLowerCase().includes(query.toLowerCase())) :
      this.transactions;

    this.filteredTrans = (query) ?
      this.transactions.filter(p => p.noPatG.toLowerCase().includes(query.toLowerCase())) :
      this.transactions;
    this.findtotal();
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


  filterNama(query: any) {
    console.log(query)
    if (this.fromDate && this.toDate) {
      this.transService.getTransactionDateRange(this.fromDate, this.toDate)
        .subscribe((resultArray) => {
          this.filteredTrans = this.transactions = resultArray;
          this.filteredTrans = (query.target.value) ?
            this.transactions.filter(p => p.nama.toLowerCase().includes(query.target.value.toLowerCase())) :
            this.transactions;
          this.findtotal();
        },
          error => console.log("Error :: " + error)
        );
    }
  }

  filterNoPatG(query: any) {


    if (this.fromDate && this.toDate) {
      this.transService.getTransactionDateRange(this.fromDate, this.toDate)
        .subscribe((resultArray) => {
          this.filteredTrans = this.transactions = resultArray;
          this.filteredTrans = (query.target.value) ?
            this.transactions.filter(p => p.noPatG.toLowerCase().includes(query.target.value.toLowerCase())) :
            this.transactions;
          this.findtotal();
        },
          error => console.log("Error :: " + error)
        );
    }
  }

  
  changeSearchBy(e: any) {
    e.target.value == "Tarikh Belian" ? this.showDate = true : this.showDate = false;
    e.target.value == "Nama Penjual" ? this.showName = true : this.showName = false;
    e.target.value == "No PatG" ? this.showNoPatg = true : this.showNoPatg = false;
  }


  filterDate() {
    if (this.fromDate && this.toDate) {
      this.transService.getTransactionDateRange(this.fromDate, this.toDate)
        .subscribe((resultArray) => {
          this.filteredTrans = this.transactions = resultArray;
          this.findtotal();
        },
          error => console.log("Error :: " + error)
        );
    }
  }

  displaySelected() {

    console.log(this.filteredTrans);

    const queryParams = { filteredTrans: JSON.stringify(this.filteredTrans) };
    const navigationExtras = {
      skipLocationChange: true,
      queryParams,
    };

    this.router.navigate(['printbyname'], navigationExtras);

  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  exportToExcel(data: any[], fileName: string) {

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
      NamaPenjual: '',
      NoPatG: '',
      NoResit: '',
      Lateks: this.totalLateks,
      Sekerap: this.totalSekerap,
      DRC: '',
      Harga: '',
      Jumlah: this.totalPrice,
    };

    filteredData.push(totalRow);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Belian Pekebun Kecil');

    // Save the Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }


}

