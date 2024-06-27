import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  title = 'AA GROUP';
  isLoggedIn = false;

  constructor(private router:Router){}

  ngOnInit(): void {
  
    if (localStorage.getItem('TICKET') != '') {
      this.isLoggedIn = true;
      console.log("true")
      this.router.navigate(['/apps/products']).then(() => {
        window.scrollTo(0, 0);
      })
    }
     else if (localStorage.getItem('TICKET') == ''){
      this.isLoggedIn = false;   
        console.log("false")
        this.router.navigate(['/login']).then(() => {
          window.scrollTo(0, 0);
        })
    }
  }
  
  
  
}
