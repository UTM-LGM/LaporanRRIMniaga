import { Component } from '@angular/core';
import { TransService } from '../services/trans.service';
import { scheme } from '../models/scheme';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-average-price',
  templateUrl: './average-price.component.html',
  styleUrls: ['./average-price.component.css']
})
export class AveragePriceComponent {

  scheme: scheme = {} as scheme;
  userClaims: any
  selectedMonth: string = ''; // or set it to a default month
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  filteredMonths: string[];

  scheme1 = { bulan: '' };
  dealerID: string = ''
  schemes : any;
  disablebtn: boolean = false;
  submitButtonDisabled: boolean = false; 
  currentMonth : number = 0;

  constructor(
    private transService: TransService,
    private toastrService: ToastrService, public userService: UserService
  ) {
    // Get the current month (0-indexed)
    const currentMonthIndex = new Date().getMonth();

    // Create an array of months excluding the current and next months
    this.filteredMonths = this.months.filter((month, index) => index !== currentMonthIndex && index !== (currentMonthIndex + 1) % 12);
  }

  ngOnInit() {
    this.setPreviousMonth();
    this.currentMonth =  new Date().getMonth() ;
    this.transService.GetListPriceDRC().subscribe(data => {
      console.log(data);
      this.schemes = data.forEach(  dataScheme => {
        if (dataScheme.bulan == this.currentMonth.toString()){
          this.disablebtn = true
        } 
      })
      // this.schemes =    this.checkDataSubmittedForCurrentMonth();
      // this.checkDataSubmittedForCurrentMonth();
    });
  }

  checkDataSubmittedForCurrentMonth() {
    // Check if data has been submitted for the current month
    // Logic to determine whether data has been submitted for the current month
    this.submitButtonDisabled = true; // Set to true if data has been submitted for the current month
  }

  checkRequired() {

    if (
      (this.scheme.rtypecode == null) ||
      (this.scheme.harga == null || this.scheme.harga == '') ||
      (this.scheme.drc == null || this.scheme.drc == '')
    ) {
      this.toastrService.warning("Sila isi semua maklumat")
      return false;
    }
    return true;
  }



  addAveragePrice() {
    this.userService.getUserClaims().subscribe(resUserClaim => {
      this.userClaims = resUserClaim
      const dealerIDFromSession = this.userClaims.DealerID
      if (dealerIDFromSession !== null) {
        this.dealerID = dealerIDFromSession;
      } else {
        console.error('dealerID is null in sessionStorage.');
      }

      this.scheme.updatedDate = new Date
      this.scheme.dealerid = parseInt(this.dealerID)
      console.log('Data to be uploaded:', this.scheme);

      if (this.checkRequired()) {

        this.transService.UploadPriceDRC(this.scheme)
          .subscribe((result: scheme) => {
            console.log('Data uploaded successfully', result);
            console.log(this.scheme)

          }, error => {

            this.toastrService.success('Data berjaya disimpan', 'Berjaya', {
              timeOut: 3000,
            });

            setTimeout(() => {
              window.location.reload();
            }, 1000);

          });

        this.transService.updateHargaDrcPurata(
          this.scheme.dealerid,
          this.scheme.rtypecode,
          this.scheme.bulan,
          this.scheme.tahun,
          this.scheme.drc,
          this.scheme.harga,

        ).subscribe((result: scheme) => {

          console.log('Service call result:', result);
        });
      }
    })

  }


  onJenisGetahChange(value: string) {
    console.log('Selected Jenis Getah:', value);
  }


  setPreviousMonth() {

    // Get the current date
    const currentDate = new Date();

    // Get the previous month's index
    const previousMonthIndex = currentDate.getMonth() - 1;

    // Handle wrapping to the previous year if necessary
    const adjustedMonthIndex = (previousMonthIndex + 12) % 12;

    // Get the month number (1-12)
    const previousMonthNumber = adjustedMonthIndex + 1;

    // Get the previous year
    const previousYear = adjustedMonthIndex === 11 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

    // Set the value of scheme.bulan to the previous month number
    this.scheme.bulan = previousMonthNumber.toString().padStart(2, '0'); // Pad with leading zero if needed

    // Set the value of scheme.tahun to the previous year
    this.scheme.tahun = previousYear.toString();
  }



  addDecimal(event: any) {
    // Get the input value
    let value = event.target.value;
  
    // Remove non-numeric characters except for dot '.'
    value = value.replace(/[^0-9.]/g, '');
  
    // Check if the decimal point is clicked
    if (event.data === '.') {
      // Move cursor to the end of the value
      event.target.selectionStart = event.target.selectionEnd = value.length;
    }
  
    // Remove any existing decimal point
    value = value.replace('.', '');
  
    // If value is not empty and has more than two characters, insert decimal point
    if (value.length > 2) {
      value = value.slice(0, -2) + '.' + value.slice(-2);
    }
  
    // Update the input value
    event.target.value = value;
  
    // Update the ngModel binding
    this.scheme.harga = value;
    console.log(value)
  }
  
}