import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransService } from '../services/trans.service';
import { pembayaran } from '../models/pembayaran';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent {

  sellerNames: any[] = [];
  payments: pembayaran[] = [];
  pekebunTemp: pembayaran[] = []

  dealerPekebunId: string = ''
  selectedSellerName: any
  totalPrice: number = 0;
  checkedItem: any;
  receiptNumber: string = '';
  date: Date = new Date();
  tapperNames: any;
  type: string = ''
  listTapper: any
  receiptPayment: any
  selectedRubber: any
  receiptNo: any;


  constructor(private transService: TransService, private router: Router) { }

  ngOnInit(): void {
    this.transService.getreceipt().subscribe(
      (data) => {
        this.sellerNames = data;
        console.log(this.sellerNames)

        this.sellerNames.sort((a, b) => {
            const sellerNamesA = a.nama.toLowerCase();
            const sellerNamesB = b.nama.toLowerCase();

            if (sellerNamesA < sellerNamesB) {
                return -1;
            }
            if (sellerNamesA > sellerNamesB) {
                return 1;
            }
            return 0; 
        });


        this.findtotal();
      });
  }

  findtotal() {
    this.totalPrice = 0;
    this.payments.forEach(element => {
      this.totalPrice = this.totalPrice + element.total;
    })
  }


  //by smallholderId
  filterTapperWithoutPatgPayment(event: any) {
    this.payments = [];
    console.log(event.target.value);

    if (event.target.value) {
      // Call the service to get Tapper data
      this.transService.GetTapperWithoutPatgPayment(event.target.value).subscribe(
        (data) => {
          //display all data pekebun payments list 
          this.tapperNames = data;
          console.log(this.tapperNames);

          // Now, call the service to get Receipt data. display only se
          this.transService.GetReceiptPayment(this.tapperNames[0].dealerPekebunId).subscribe(
            (data) => {
              this.listTapper = data[0];
              this.payments = this.listTapper.list;
              this.pekebunTemp = this.payments
              this.findtotal();
              console.log(this.payments);
            },
            (error) => {
              console.error('Error fetching receipt data:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching tapper data:', error);
        }
      );
    }
  }


  //by dealerPekebunId
  filterReceiptPayment(event: any) {
    this.receiptPayment = event.target.value
    console.log(this.receiptPayment)

    if (this.receiptPayment) {
      this.transService.GetReceiptPayment(this.receiptPayment).subscribe(
        (data) => {
          this.listTapper = data[0];
          this.payments = this.listTapper.list
          console.log(this.payments);
        },
        (error) => {
          console.error('Error fetching tapper data:', error);
        }
      );
    }
    this.findtotal();
  }


  filterRubberType(event: any): void {
    this.selectedRubber = event.target.value

    this.payments = (this.selectedRubber) ?
      this.pekebunTemp.filter(p => p.type.toLowerCase().includes(this.selectedRubber.toLowerCase())) :
      this.payments;
    this.findtotal();
  }


  getSelectedItem() {
    this.checkedItem = this.payments.filter(payments => payments.checked)
    // .map(pekebun => pekebun.dealerPekebunId);
  }


  print() {

    this.payments = this.payments.filter(payments => payments.checked);

    console.log(this.checkedItem);

    const queryParams = { pekebun: JSON.stringify(this.payments), listTapper: JSON.stringify(this.listTapper) };
    const navigationExtras = {
      skipLocationChange: true,
      queryParams,
    };

    this.router.navigate(['receipt'], navigationExtras);
  }

}
