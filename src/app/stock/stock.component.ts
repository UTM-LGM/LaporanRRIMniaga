import { Component, OnInit } from '@angular/core';
import { stock } from '../models/stock';
import { TransService } from '../services/trans.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit{

  stocks:stock = {} as stock;

  constructor(private transService:TransService) { }

  ngOnInit() {
    this.getStock();
  }

  getStock(): void {
    this.transService.getStockCurrentMonth()
        .subscribe((stok) => {
          this.stocks = stok
        },
            error => console.log("Error :: " + error)    
        )
}
}
