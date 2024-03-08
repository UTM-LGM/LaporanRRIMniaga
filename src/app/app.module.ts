import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LayoutComponent } from './layout/layout.component';
import { JualanfarmgateComponent } from './jualanfarmgate/jualanfarmgate.component';
import { HomeComponent } from './home/home.component';
import { SellTransComponent } from './sell-trans/sell-trans.component';
import { StockComponent } from './stock/stock.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransbyuseridComponent } from './transbyuserid/transbyuserid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { PurchaseComponent } from './purchase/purchase.component';
import { TransfractionComponent } from './transfraction/transfraction.component';
import { FormsModule } from '@angular/forms';
import { PrintComponent } from './print/print.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { AuthGuard } from './auth/auth.guard';
import { UserComponent } from './user/user.component';
import { ToastrModule } from 'ngx-toastr';
import { TransbyuserdetailComponent } from './transbyuserdetail/transbyuserdetail.component';
import { PrintTransactionComponent } from './print-transaction/print-transaction.component';
import { PurchasebynameComponent } from './purchasebyname/purchasebyname.component';
import { PrintbynameComponent } from './printbyname/printbyname.component';
import { AveragePriceComponent } from './average-price/average-price.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { ReceiptComponent } from './receipt/receipt.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ViewAveragePriceComponent } from './view-average-price/view-average-price.component';
import { ReceiptSkrapComponent } from './receipt/receipt-skrap/receipt-skrap.component';
import { ReceiptLateksComponent } from './receipt/receipt-lateks/receipt-lateks.component';
import { UpdateHargaDRCPurataComponent } from './update-harga-drcpurata/update-harga-drcpurata.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ToolbarComponent,
    LayoutComponent,
    JualanfarmgateComponent,
    HomeComponent,
    SellTransComponent,
    StockComponent,
    TransactionComponent,
    TransbyuseridComponent,
    PurchaseComponent,
    TransfractionComponent,
    PrintComponent,
    SignInComponent,
    SignUpComponent,
    UserComponent,
    TransbyuserdetailComponent,
    PrintTransactionComponent,
    PurchasebynameComponent,
    PrintbynameComponent,
    AveragePriceComponent,
    PaymentInfoComponent,
    ReceiptComponent,
    ViewAveragePriceComponent,
    ReceiptSkrapComponent,
    ReceiptLateksComponent,
    UpdateHargaDRCPurataComponent,
    
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule,
    MatCheckboxModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatIconModule,
    MatTooltipModule,
    MatDialogModule

    

  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
