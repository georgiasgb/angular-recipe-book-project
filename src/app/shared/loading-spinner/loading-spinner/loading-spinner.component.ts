import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  // templateUrl: './loading-spinner.component.html',
  template: `<div class="lds-facebook"><div></div><div></div><div></div></div>`,
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}