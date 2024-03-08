import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransService } from '../services/trans.service';
import { pembayaran } from '../models/pembayaran';


@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent {

  listTapper: any
  dealerPekebuns: any;
  dealerPekebunId: string = '';
  pekebun: pembayaran[] = [];
  pembayaran: any;
  type: string = '';
  isLateks: boolean = false
  isSkrap: boolean = false
  receiptNumber: string = ''
  dealerID: string = ''
  date: Date = new Date();
  ReceiptNo: string = '';
  // printed: boolean = false;

  constructor
    (private transService: TransService, private activateRoute: ActivatedRoute) { }


  ngOnInit() {

    this.activateRoute.queryParams.subscribe(params => {

      if (params['listTapper']) {
        this.listTapper = JSON.parse(params['listTapper']);
        // this.listTapper = data[0];
        // this.pekebun = this.listTapper.list
        console.log(this.listTapper)

        this.dealerPekebunId = this.listTapper.dealerPekebunId
        console.log(this.dealerPekebunId)

      }

      if (params['pekebun']) {
        this.pekebun = JSON.parse(params['pekebun']);

        console.log(this.pekebun)

        for (const transaction of this.pekebun) {

          if (transaction.type == 'Lateks') {
            this.isLateks = true

          } else if (transaction.type == 'Skrap') {
            this.isSkrap = true


          }
        }

      }
    })

  }

  padTo2Digits(num: number) {
    // return num.toString().padStart(2, '0');
    return num < 10 ? "0" + num : num.toString();
  }

  generateReceipt() {
    const dealerIDFromSession = sessionStorage.getItem('dealerID');
    if (dealerIDFromSession !== null) {
      this.dealerID = dealerIDFromSession;
    } else {
      console.error('dealerID is null in sessionStorage.');
    }

    const year = this.date.getFullYear();
    const formattedYear = year.toString().slice(-2);
    const month = this.padTo2Digits(this.date.getMonth() + 1);
    const day = this.padTo2Digits(this.date.getDate());
    const hours = this.padTo2Digits(this.date.getHours());
    const minutes = this.padTo2Digits(this.date.getMinutes());
    const seconds = this.padTo2Digits(this.date.getSeconds());

    const sum = parseInt(formattedYear) + parseInt(month, 10) + parseInt(day, 10) + parseInt(this.dealerID, 10) + parseInt(this.dealerPekebunId, 10);
    const lastDigit = sum % 10;

    this.receiptNumber = "W" + formattedYear + month + day + lastDigit + hours + minutes + seconds;
    console.log(this.receiptNumber);

    this.activateRoute.queryParams.subscribe(params => {
      if (params['pekebun']) {
        this.pekebun = JSON.parse(params['pekebun']);
        console.log(this.pekebun);
      }
    });
  }


  @ViewChild('pdfContent', { static: false }) pdfContent: ElementRef | undefined;

  // printPDF() {
  //   this.generateReceipt();

  //   // Define a variable to track if printing has been done
  //   let printed = false;

  //   this.pekebun.forEach(element => {
  //     if (element.type == 'Lateks') {
  //       element.noResit = this.receiptNumber + "2";
  //     } else if (element.type == 'Skrap') {
  //       element.noResit = this.receiptNumber + "1";
  //     }

  //     this.date = new Date();
  //     element.paymentDate = this.date.toISOString().substring(0, 19);

  //     this.transService.updatePembayaran(element.transactionId, element)
  //       .subscribe(
  //         () => {
  //           console.log('Payment information updated successfully.');
  //         }
  //       );

  //     if (!printed) {
  //       const printContents = this.pdfContent?.nativeElement.innerHTML;
  //       document.body.innerHTML = printContents;
  //       window.print();
  //       printed = true; // Set printed to true to avoid printing again
  //     }
  //   });
  // }





  async printPDF() {
    this.generateReceipt();
  
    let printed = false; // Flag to track whether the PDF has been printed
  
    for (const element of this.pekebun) {
      if (element.type == 'Lateks') {
        element.noResit = this.receiptNumber + "2";
      } else if (element.type == 'Skrap') {
        element.noResit = this.receiptNumber + "1";
      }
  
      this.date = new Date();
      element.paymentDate = this.date.toISOString().substring(0, 19);
  
      try {
        await this.transService.updatePembayaran(element.transactionId, element).toPromise();
        console.log('Payment information updated successfully.');
      } catch (error) {
        console.error('Error updating payment information:', error);
      }
    }
  
    if (!printed) {
      const printContents = this.pdfContent?.nativeElement.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      printed = true; // Set printed to true to avoid printing again
    }
  }
  

}