import { Component } from '@angular/core';
import { sell } from '../models/sell';
import { TransService } from '../services/trans.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { stock } from '../models/stock';

@Component({
  selector: 'app-sell-trans',
  templateUrl: './sell-trans.component.html',
  styleUrls: ['./sell-trans.component.css']
})
export class SellTransComponent {

  sell: sell[] = [];
  filteredTrans: any[] = [];
  transac: any[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  showDate: boolean = false
  showName: boolean = false
  showNoLicense: boolean = false
  searchBy: string[] = []
  fromDate: any;
  toDate: any;
  stocks: stock = {} as stock;
  datePipe: any;


  constructor(private transService: TransService, private route: ActivatedRoute, private router: Router) {
    this.sell = [];
  }

  ngOnInit(): void {
    this.getStock();

    this.route.params.subscribe(routeParams => {
      console.log(routeParams['fromDate'], routeParams['toDate']);
      if (routeParams['fromDate'] != null && routeParams['toDate'] != null) {
        this.transService.getSellTransactionDateRange(routeParams['fromDate'], routeParams['toDate'])
          .subscribe((resultArray) => {
            this.filteredTrans =
              this.sell = resultArray,
              this.findtotal();
          },
            error => console.log("Error :: " + error)
          )
      }
    });

    this.fromDate = this.fromDate
    this.toDate = this.toDate

    this.searchBy = [
      'Nama Pembeli',
      'No Lesen',
    ];
  }

  getStock(): void {
    this.transService.getStockCurrentMonth()
      .subscribe((stok) => {
        this.stocks = stok
      },
        error => console.log("Error :: " + error)
      )
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

  filter(query: string) {
    this.filteredTrans = (query) ?
      this.sell.filter(p => p.nama.toLowerCase().includes(query.toLowerCase())) :
      this.sell;
    this.findtotal();
  }

  filterNama(query: string) {
    this.filteredTrans = (query) ?
      this.sell.filter(p => p.nama.toLowerCase().includes(query.toLowerCase())) :
      this.sell;
    this.findtotal();
  }

  filterNoLicense(query: string) {
    this.filteredTrans = (query) ?
      this.sell.filter(p => p.noLicense.toLowerCase().includes(query.toLowerCase())) :
      this.sell;
    this.findtotal();
  }

  changeSearchBy(e: any) {
    e.target.value == "Tarikh Belian" ? this.showDate = true : this.showDate = false;
    e.target.value == "Nama Pembeli" ? this.showName = true : this.showName = false;
    e.target.value == "No Lesen" ? this.showNoLicense = true : this.showNoLicense = false;
  }

  filterDate() {
    if (this.fromDate && this.toDate) {
      this.transService.getSellTransactionDateRange(this.fromDate, this.toDate)
        .subscribe((resultArray) => {
          this.filteredTrans = this.sell = resultArray;
          this.findtotal();
        },
          error => console.log("Error :: " + error)
        );
    }
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

  // exportToExcel(data: any[], fileName: string) {
  //   const filteredData = data.map((row) => ({

  //     Tarikh: row.transDate,
  //     NamaPenjual : row.nama,
  //     NoPatG: row.noPatG,
  //     NoResit: row.noResit,
  //     Lateks: row.lateks,
  //     Sekerap: row.sekerap,
  //     DRC: row.drc,
  //     Harga: row.unitPrice,
  //     Jumlah: row.total

  //   }));

  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   // Save the Excel file
  //   XLSX.writeFile(wb, `${fileName}.xlsx`);
  // }

  // Define a helper function to format the date
  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  exportToExcel(data: any[], stocks: any, fileName: string) {

    let bilCounter = 1;
    const filteredData = data.map((row) => ({
      // Tarikh: row.transDate,
      Bil: bilCounter++,
      Tarikh: this.formatDate(new Date(row.transDate)),
      NamaPembeli: row.nama,
      NoLesen: row.noLicense,
      NoResit: row.noResit,
      Lateks: row.lateks,
      Sekerap: row.sekerap,
      Jumlah: row.total,
    }));

    // Calculate and add the totals
    const totalRow = {
      Bil: 0,
      Tarikh: 'Total:',
      NamaPembeli: '',
      NoLesen: '',
      NoResit: '',
      Lateks: this.totalLateks,
      Sekerap: this.totalSekerap,
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
    XLSX.utils.book_append_sheet(wb, filteredWs, 'Jualan');


    // Convert the stock data to a worksheet
    const stockWs: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(stockData);
    XLSX.utils.book_append_sheet(wb, stockWs, 'Maklumat Stok');

    // Save the Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

}
