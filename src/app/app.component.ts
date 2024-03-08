import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RRIMniaga';

  isLoggin: boolean = false;
  loginPage: boolean = true;

  userToken : string = ""
  registerPage: boolean = false


  
  ngOnInit(){
    this.userToken =JSON.stringify( sessionStorage.getItem('userToken'))
    
    if (sessionStorage.getItem('userToken')!= null) {
      this.isLoggin = true
      console.log(this.userToken, this.isLoggin)
    }
    else if (sessionStorage.getItem('userToken') == null){
      this.isLoggin = false
      console.log(this.userToken, this.isLoggin)
    }
  }
}
