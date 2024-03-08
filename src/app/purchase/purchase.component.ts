import { Component } from '@angular/core';
import { TransService } from '../services/trans.service';
import { ActivatedRoute, Router } from '@angular/router';
import { transaction } from '../models/transaction';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent {

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

  constructor(private transService: TransService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {

    this.transService.getTransactionDateRange(this.fromDate, this.toDate)
      .subscribe((resultArray) => {
        console.log(resultArray)
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
      this.transService.getTransactionDateRange(this.fromDate, this.toDate)
        .subscribe((resultArray) => {
          this.filteredTrans = this.transactions = resultArray;
          this.findtotal();
        },
          error => console.log("Error :: " + error)
        );
    }
  }

  cetak() {

  }

  displaySelected() {

    const queryParams = { filteredTrans: JSON.stringify(this.filteredTrans) };
    const navigationExtras = {
      skipLocationChange: true,
      queryParams,
    };

    this.router.navigate(['print'], navigationExtras);
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
    XLSX.utils.book_append_sheet(wb, ws, 'Belian');

    // Save the Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }


}
