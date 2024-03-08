import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { SellTransComponent } from './sell-trans/sell-trans.component';
import { TransbyuseridComponent } from './transbyuserid/transbyuserid.component';
import { TransfractionComponent } from './transfraction/transfraction.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PrintComponent } from './print/print.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { AuthGuard } from './auth/auth.guard';
import { PrintTransactionComponent } from './print-transaction/print-transaction.component';
import { PurchasebynameComponent } from './purchasebyname/purchasebyname.component';
import { PrintbynameComponent } from './printbyname/printbyname.component';
import { AveragePriceComponent } from './average-price/average-price.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { ReceiptLateksComponent } from './receipt/receipt-lateks/receipt-lateks.component';
import { ReceiptSkrapComponent } from './receipt/receipt-skrap/receipt-skrap.component';
import { UpdateHargaDRCPurataComponent } from './update-harga-drcpurata/update-harga-drcpurata.component';

const routes: Routes = [

  // {
  //   path : "PRIMniaga", component:HomeComponent, pathMatch: "full"
  // },

  { path: '', redirectTo: 'signIn', pathMatch: 'full' },

  {
    path: 'home',
    component: HomeComponent, canActivate: [AuthGuard]
  },

  {
    path: 'transaction',
    component: TransactionComponent, canActivate: [AuthGuard]
  },


  {
    path: 'purchase',
    component: PurchaseComponent, canActivate: [AuthGuard]
  },

  {
    path: 'sellTrans',
    component: SellTransComponent, canActivate: [AuthGuard]
  },

  {
    path: 'transbyuserid',
    component: TransbyuseridComponent, canActivate: [AuthGuard]
  },

  {
    path: 'transfraction',
    component: TransfractionComponent, canActivate: [AuthGuard]
  },

  {
    path: 'print',
    component: PrintComponent, canActivate: [AuthGuard]
  },

  {
    path: 'printTransaction',
    component: PrintTransactionComponent, canActivate: [AuthGuard]
  },

  {
    path: 'purchasebyname',
    component: PurchasebynameComponent, canActivate: [AuthGuard]
  },

  {
    path: 'printbyname',
    component: PrintbynameComponent, canActivate: [AuthGuard]
  },

  // {
  //   path:'signIn',
  //   component: SignInComponent
  // },

  // {
  //   path:'signUp',
  //   component: SignUpComponent
  // },
  // {
  //   path : 'user', component:UserComponent
  // }
  {
    path: 'signUp', component: SignUpComponent,
    children: [{ path: '', component: SignUpComponent }]
  },
  {
    path: 'signIn', component: SignInComponent,
    children: [{ path: '', component: SignInComponent }]
  },


  {
    path: 'averagePrice',
    component: AveragePriceComponent, canActivate: [AuthGuard]
  },

  {
    path: 'payment-info',
    component: PaymentInfoComponent, canActivate: [AuthGuard]
  },

  {
    path: 'receipt',
    component: ReceiptComponent, canActivate: [AuthGuard]
  },

  {
    path: 'receipt-lateks',
    component: ReceiptLateksComponent, canActivate: [AuthGuard]
  },

  {
    path: 'receipt-skrap',
    component: ReceiptSkrapComponent, canActivate: [AuthGuard]
  },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

