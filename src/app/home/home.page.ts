import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    spaceBetween: 20,
  };

  dateNow:any;
  constructor(
    private api: ApiService,
    private datePipe: DatePipe
  ) {}

  prayTime:any;
  timesToday:any;
  async ngOnInit() { 
    this.dateNow = new Date();
    this.prayTime = await this.api.getToday();
    this.timesToday = this.prayTime.datetime[0];
  }


  checkTime(n, b) {
    let arr = [];
    let arr2 = [];
    let arr3 = [];
    let time_start = undefined;
    let time_before = undefined;
    let timeNow = undefined;
    let now = undefined;
    arr = n.split(':');
    arr2 = b.split(':');
    time_start = new Date(this.timesToday.date.gregorian).setHours(arr[0], arr[1], 0);
    time_before = new Date(this.timesToday.date.gregorian).setHours(arr2[0], arr2[1], 0);

    timeNow = this.datePipe.transform(new Date(), 'HH:mm:ss');
    arr3 = timeNow.split(':');
    now = new Date(this.timesToday.date.gregorian).setHours(Number(arr3[0]), Number(arr3[1]), Number(arr3[2]));
    if(new Date(now) >= new Date(time_start) && new Date(now) < new Date(time_before)) {
      return true;
    } else {
      return false;
    }
  }
}
