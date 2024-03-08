import { Component } from '@angular/core';
import { TransService } from '../services/trans.service';
import { scheme } from '../models/scheme';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-update-harga-drcpurata',
  templateUrl: './update-harga-drcpurata.component.html',
  styleUrls: ['./update-harga-drcpurata.component.css']
})
export class UpdateHargaDRCPurataComponent {

  scheme: scheme = {} as scheme;
  dealerID: string = ''
  filteredMonths: string[];
  selectedMonth: string = ''; // or set it to a default month
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(
    private transService: TransService,
    private route: Router,
  ) {
    // Get the current month (0-indexed)
    const currentMonthIndex = new Date().getMonth();

    // Create an array of months excluding the current and next months
    this.filteredMonths = this.months.filter((month, index) => index !== currentMonthIndex && index !== (currentMonthIndex + 1) % 12);
  }
  ngOnInit() {
    this.setPreviousMonth()
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


  updateAveragePrice() {
    const dealerIDFromSession = sessionStorage.getItem('dealerID');
    if (dealerIDFromSession !== null) {
      this.dealerID = dealerIDFromSession;
    } else {
      // Handle the case where dealerID is null
      console.error('dealerID is null in sessionStorage.');
    }

    this.scheme.updatedDate = new Date
    this.scheme.dealerid = parseInt(this.dealerID)
    console.log('Data to be uploaded:', this.scheme);

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



}

