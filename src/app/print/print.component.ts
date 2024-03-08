import { Component, ElementRef, ViewChild } from '@angular/core';
import { transaction } from '../models/transaction';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent {

  isPrintButtonClicked = false; // Add this variable

  transactions: transaction[] = [];
  filteredTrans: any[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  userInput: any

  constructor
    (private route: ActivatedRoute, private router: Router,) {
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

  // exportToExcel(filteredTrans: any[], fileName: string) {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredTrans);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   // Save the Excel file
  //   XLSX.writeFile(wb, `${fileName}.xlsx`);
  // }

  exportToExcel(data: any[], fileName: string) {
    const filteredData = data.map((row) => ({

      transDate: row.transDate,
      nama: row.nama,
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
    this.isPrintButtonClicked = true;
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


  goBack() {
    this.router.navigate(['/purchase']);
  }

  filter(query: string) {
    this.filteredTrans = (query) ?
      this.transactions.filter(p => p.nama.toLowerCase().includes(query.toLowerCase())) :
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

}
