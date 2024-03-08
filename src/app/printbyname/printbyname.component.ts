import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { transaction } from '../models/transaction';
import { TransService } from '../services/trans.service';
import { ActivatedRoute } from '@angular/router';
import { user } from '../models/user';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-printbyname',
  templateUrl: './printbyname.component.html',
  styleUrls: ['./printbyname.component.css']
})
export class PrintbynameComponent {

  transactions: transaction[] = [];
  filteredTrans: any[] = [];
  totalLateks: number = 0;
  totalSekerap: number = 0;
  totalPrice: number = 0;
  userInput: any
  userClaims: user = {} as user;
  isPrintButtonClicked = false;
  companyDetail: any

  constructor
    (private transService: TransService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['filteredTrans']) {
        this.filteredTrans = JSON.parse(params['filteredTrans']);
        console.log(this.filteredTrans)
      }
    });
  }

  ngOnInit() {
    this.transService.getTransactionByCompany()
      .subscribe(
        (companyDetails) => {
          this.companyDetail = companyDetails;
          this.findtotal();
        },
        (error) => {
          console.error("Error :: " + error);
        }
      );
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


  exportToExcel(data: any[], fileName: string) {
    const filteredData = data.map((row) => ({
      // bil: row.bil,
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
    window.history.back();
  }

}

