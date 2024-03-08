import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { transaction } from '../models/transaction';
import { transactionall } from '../models/transactionall';
import { transfrac } from '../models/transfrac';
import { transbyuserid } from '../models/transbyuserID';
import { sell } from '../models/sell';
import { stock } from '../models/stock';
import { environment } from 'src/environments/environment';
import { companyDetail } from '../models/companyDetail';
import { pembayaran } from '../models/pembayaran';
import { dealerPekebuns } from '../models/DealerPekebuns';
import { scheme } from '../models/scheme';

@Injectable({
    providedIn: 'root'
})
export class TransService {

    //   private Url = 'https://api.lgm.gov.my/api_RRIMniaga_Laporan';
    Url: string = environment.Url;
    API_RRIMniagaUrl = environment.API_RRIMniagaUrl;

    constructor(private http: HttpClient) { }

    getTransactionCurrentMonth(): Observable<transaction[]> {
        let d = new Date();
        //let m = d.getMonth()+1;
        let m = d.getMonth();
        let y = d.getFullYear();
        let id = sessionStorage.getItem('dealerID');
        // let id = 11;

        return this.http.get<transaction[]>(this.Url + '/api/transdate/GetBelian?id=' + id)

    }
    // https://api.lgm.gov.my/api_RRIMniaga_Laporan/api/transdate/GetBelian/?id=1
    getAllTransaction(): Observable<transactionall[]> {

        return this.http.get<transactionall[]>(this.Url + '/api/trans/getAllTransaction2')
    }


    getTransFraction(fromDate: Date, toDate: Date): Observable<transfrac[]> {
        let id = sessionStorage.getItem('dealerID');
        // let id = 11;
        // return this.http
        //     .get(this.Url +'/api/report/GetReportTapperWithoutPatg/?dealerid=' + id +'&dates1=' + fromDate +'&dates2=' + toDate)
        //     //.get(this.Url +'/api/report/GetReportTapperWithoutPatg/?dealerid=1&dates1=2018-03-26&dates2=2018-05-30')
        //     .map((response: Response) => {
        //         return <transfrac[]>response.json();
        //     })
        //     .catch(this.handleError);

        return this.http.get<transfrac[]>(this.Url + '/api/report/GetReportTapperWithoutPatg/?dealerid=' + id + '&dates1=' + fromDate + '&dates2=' + toDate)

    }

    getTransactionbyDate(fromDate: Date, toDate: Date): Observable<transbyuserid[]> {
        let id = sessionStorage.getItem('dealerID');
        // let id = 11;
        // return this.http
        //     .get(this.Url + '/api/report/GetReportbyusernameperday/?dealerid=' + id +'&dates1=' + fromDate +'&dates2=' + toDate)
        //     .map((response: Response) => {
        //         return <transbyuserid[]>response.json();
        //     })
        //     .catch(this.handleError);    

        return this.http.get<transbyuserid[]>(this.Url + '/api/report/GetReportbyusernameperday/?dealerid=' + id + '&dates1=' + fromDate + '&dates2=' + toDate)


    }

    getTransactionbyUser(fromDate: Date, toDate: Date, userid: number): Observable<transbyuserid[]> {
        let id = sessionStorage.getItem('dealerID');

        return this.http.get<transbyuserid[]>(this.Url + '/api/Transdate/GetBetweenDateDrcNotNullbyUser/?id=' + id + '&dates1=' + fromDate + '&dates2=' + toDate + '&userid=' + userid);
    }




    getSellCurrentMonth(): Observable<sell[]> {
        let d = new Date();
        //let m = d.getMonth()+1;
        let m = d.getMonth();
        let y = d.getFullYear();
        // let id = sessionStorage.getItem('dealerID');
        let id = 11;

        // return this.http
        //     .get(this.Url +'/api/sell/GetJualan/?id=' + id )
        //     .map((response: Response) => {
        //         return <sell[]>response.json();
        //     })
        //     .catch(this.handleError);

        return this.http.get<sell[]>(this.Url + '/api/sell/GetSellReportByMonth/?id=' + id + '&year=' + y + '&month=' + m)

    }

    getStockCurrentMonth(): Observable<stock> {
        let d = new Date();
        //let m = d.getMonth()+1;
        let m = d.getMonth();
        let y = d.getFullYear();
        let id = sessionStorage.getItem('dealerID');
        // let id = 11;

        // return this.http
        //     .get(this.Url +'/api/sell/getstokbulanan/?id=' + id )
        //     .map((response: Response) => {
        //         return <stock>response.json();
        //     })
        //     .catch(this.handleError);

        return this.http.get<stock>(this.Url + '/api/sell/getstokbulanan/?id=' + id)
    }

    getStockCurrentMonthBelian(): Observable<stock> {
        let d = new Date();
        //let m = d.getMonth()+1;
        let m = d.getMonth() + 1;
        let y = d.getFullYear();
        let id = sessionStorage.getItem('dealerID');
        // let id = 11;

        // return this.http
        //     .get(this.Url +'/api/sell/GetStockReportByMonth/?id=' + id +'&year='+ y +'&month=' + m)
        //     .map((response: Response) => {
        //         return <stock>response.json();
        //     })
        //     .catch(this.handleError);

        return this.http.get<stock>(this.Url + '/api/sell/getstokbulanan/?id=' + id)
    }

    getTransactionDateRange(fromDate: Date, toDate: Date): Observable<transaction[]> {
        console.log(fromDate, toDate)
        let id = sessionStorage.getItem('dealerID');
        // let id = 11;
        //   return this.http
        //       .get(this.Url + '/api/Transdate/getbetweendateDrcNotnull/?id=' + id +'&dates1=' + fromDate +'&dates2=' + toDate)
        //       .map((response: Response) => {
        //           return <transaction[]>response.json();
        //       })
        //       .catch(this.handleError);

        return this.http.get<transaction[]>(this.Url + '/api/Transdate/getbetweendateDrcNotnull/?id=' + id + '&dates1=' + fromDate + '&dates2=' + toDate)

    }


    getTransactionByCompany(): Observable<companyDetail[]> {
        let id = sessionStorage.getItem('dealerID');
        return this.http.get<companyDetail[]>(this.Url + '/api/eR1_lgm/dealerid?id=' + id)

    }

    getSellTransactionDateRange(fromDate: Date, toDate: Date): Observable<sell[]> {
        let id = sessionStorage.getItem('dealerID');
        // let id = 11;
        //   return this.http
        //       .get(this.Url + '/api/Transdate/getbetweendateDrcNotnull/?id=' + id +'&dates1=' + fromDate +'&dates2=' + toDate)
        //       .map((response: Response) => {
        //           return <transaction[]>response.json();
        //       })
        //       .catch(this.handleError);

        return this.http.get<sell[]>(this.Url + '/api/Sell/GetSellReportBetweenDates/?id=' + id + '&date1=' + fromDate + '&date2=' + toDate)
    }


    getreceipt(): Observable<pembayaran[]> {
        let id = sessionStorage.getItem('dealerID');
        return this.http.get<pembayaran[]>(this.Url + '/api/pembayaran/getReceipt/?id=' + id)
    }

    GetTapperWithoutPatgPayment(smallHolderId: number) {
        let id = sessionStorage.getItem('dealerID');
        console.log(smallHolderId)
        console.log(id)
        return this.http.get(`${this.API_RRIMniagaUrl}DealerPekebuns/GetTapperWithoutPatgPayment/?smallholderid=${smallHolderId}&dealerid=${id}`);
    }


    GetReceiptPayment(dealerPekebunId: number): Observable<pembayaran[]> {
        let id = sessionStorage.getItem('dealerID');
        // return this.http.get<pembayaran[]>(this.API_RRIMniagaUrl + 'pembayaran/GetReceiptPayment/?dealerpekebunid =${dealerpekebunid}'+ id)
        return this.http.get<pembayaran[]>(`${this.API_RRIMniagaUrl}/pembayaran/GetReceiptPayment/?dealerpekebunid=${dealerPekebunId}`);
    }


    UploadPriceDRC(scheme: scheme): Observable<scheme> {
        let id = sessionStorage.getItem('dealerID');
        return this.http.post<scheme>(this.Url + '/api/eR1_lgm/UploadPriceDRC', scheme);
    }


    updateHargaDrcPurata(dealerId: number, rtypeCode: number, bulan: string, tahun: string, drc: string, harga: string): Observable<scheme> {
        const url = `${this.Url}/api/Trans/UpdateHargaDrcPurata?dealerid=${dealerId}&rtypecode=${rtypeCode}&month=${bulan}&year=${tahun}&drc=${drc}&harga=${harga}`;
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.put<scheme>(url, httpOptions);
    }


    GetListPriceDRC(): Observable<scheme[]> {
        let id = sessionStorage.getItem('dealerID');
        return this.http.get<scheme[]>(this.Url + '/api/eR1_lgm/GetListPriceDRC/?dealerid=' + id)
    }


    updatePembayaran(Transactionid: number, paymentInfo: pembayaran) {
        
        paymentInfo.printed = 1
        paymentInfo.paymentStatusId = 3
        console.log(paymentInfo, Transactionid)
        // return true
        return this.http.put(this.API_RRIMniagaUrl + 'Pembayaran/editpembayaran/?id='+Transactionid,paymentInfo)
    }

    
}
