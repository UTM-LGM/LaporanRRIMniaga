import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransService } from '../../services/trans.service';
import { scheme } from '../../models/scheme';


@Component({
  selector: 'app-receipt-lateks',
  templateUrl: './receipt-lateks.component.html',
  styleUrls: ['./receipt-lateks.component.css']
})
export class ReceiptLateksComponent {


  gstNo: string = 'xxxx';
  skrNo: string = 'xxxx';
  Amount: number = 0;
  // ReceiptNo: string = 'xxxx';
  ReceiptNo: string = '';
  date: Date = new Date();
  purchases: any;
  receiptNumber: string = '';
  schemes: scheme[] = [];

  pekebun: any[] = [];
  sellers: any;

  SellerName: string = 'xxxx';
  SellerLicenseNo: string = 'xxxx';
  nama: string = 'xxxx';;
  userAddress: string = 'xxxx';
  userLicenseNo: string = 'xxxx';

  companyDetail: any
  transactions: any[] = [];
  pekebuns: any
  dealerPekebuns: any;
  selectedPenoreh: any
  listTapper: any

  totalPrice: number = 0;

  dealerID: string = ''

  dealerPekebunId: string = '';
  isLateks: boolean = false
  isSkrap: boolean = false
  selectedPekebun: any[] = []

  constructor
    (private transService: TransService, private activateRoute: ActivatedRoute) {
  }


  ngOnInit() {

    this.generateReceiptNo();

    this.activateRoute.queryParams.subscribe(params => {
      if (params['listTapper']) {
        this.listTapper = JSON.parse(params['listTapper']);
        // this.listTapper = data[0];
        // this.pekebun = this.listTapper.list
        console.log(this.listTapper)

        this.dealerPekebunId = this.listTapper.dealerPekebunId
        console.log(this.dealerPekebunId)

        let totalPrice = 0;

        for (const transaction of this.pekebun) {
          if (transaction.checked && transaction.type == 'Lateks') {
            this.selectedPekebun.push(transaction);
            totalPrice += transaction.total;
            this.generateReceiptNo();
            this.ReceiptNo = transaction.receiptNumber;
          }
        }
        console.log(this.selectedPekebun);
      }


      if (params['pekebun']) {
        this.pekebun = JSON.parse(params['pekebun']);
        console.log(this.pekebun)

        let totalPrice = 0;

        for (const pekebun of this.pekebun) {
          if (pekebun.checked && pekebun.type == 'Lateks') {

            totalPrice += pekebun.total;

            this.totalPrice += pekebun.total;
            this.ReceiptNo = pekebun.receiptNumber;

          }
        }
        console.log('Total Amaun:', totalPrice);

      }


    });

    this.transService.getTransactionByCompany()
      .subscribe(
        (companyDetails) => {
          this.companyDetail = companyDetails;
        },
        (error) => {
          console.error("Error :: " + error);
        }
      );
  }


  filterTapper(event: any) {
    this.selectedPenoreh = event.target.value
    if (this.selectedPenoreh) {
      this.transService.GetReceiptPayment(this.selectedPenoreh).subscribe(
        (data) => {
          this.listTapper = data;
          console.log(this.pekebun);
        },
        (error) => {
          console.error('Error fetching tapper data:', error);
        }
      );
    }
  }


  findtotal() {

    const selectedPekebun = [];
    let totalPrice = 0;

    for (const transaction of this.pekebun) {
      if (transaction.checked) {
        selectedPekebun.push(transaction);
        totalPrice += transaction.total;
      }
    }

    console.log(selectedPekebun);
    console.log('Total Amaun:', totalPrice);

  }


  padTo2Digits(num: number) {
    // return num.toString().padStart(2, '0');
    return num < 10 ? "0" + num : num.toString();
  }


  generateReceiptNo() {

    const dealerIDFromSession = sessionStorage.getItem('dealerID');
    if (dealerIDFromSession !== null) {
      this.dealerID = dealerIDFromSession;
    } else {
      // Handle the case where dealerID is null
      console.error('dealerID is null in sessionStorage.');
    }

    const year = this.date.getFullYear();
    const formattedYear = year.toString().slice(-2);
    const month = this.padTo2Digits(this.date.getMonth() + 1);
    const day = this.padTo2Digits(this.date.getDate());
    const hours = this.padTo2Digits(this.date.getHours());
    const minutes = this.padTo2Digits(this.date.getMinutes());
    const seconds = this.padTo2Digits(this.date.getSeconds());

    // Calculate the sum of year, month, and day
    const sum = parseInt(formattedYear) + parseInt(month, 10) + parseInt(day, 10) + parseInt(this.dealerID, 10) + parseInt(this.dealerPekebunId, 10);

    // Get the last digit of the sum
    const lastDigit = sum % 10;

    this.receiptNumber = "W" + formattedYear + month + day + lastDigit + hours + minutes + seconds + "2";
    console.log(this.receiptNumber);


    this.activateRoute.queryParams.subscribe(params => {

      if (params['pekebun']) {
        this.pekebun = JSON.parse(params['pekebun']);

        console.log(this.pekebun)

        // const selectedPekebun = [];
        let totalPrice = 0;

        for (const pekebun of this.pekebun) {
          if (pekebun.checked) {
            // selectedPekebun.push(transaction);
            totalPrice += pekebun.total;

            this.ReceiptNo = pekebun.receiptNumber;

          }
        }

        // console.log(selectedPekebun);
        console.log('Total Amaun:', totalPrice);
      }
    })

  }



  @ViewChild('pdfContent', { static: false }) pdfContent: ElementRef | undefined;
  printPDF() {
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    // const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    location.reload();
  }

}
