import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../auth/login/login.page';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

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
    autoplay: true
  };

  dateNow:any;
  listProducts:any = [];
  serverImg: any;
  constructor(
    public common: CommonService,
    private api: ApiService,
    private datePipe: DatePipe,
    public modalController: ModalController,
  ) {}

  prayTime:any;
  timesToday:any;
  async ngOnInit() {
    this.dateNow = new Date();
    this.prayTime = await this.api.getToday();
    this.timesToday = await this.prayTime.datetime[0];
    this.parseTime(this.timesToday);
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.getAllProducts();
  }

  async doRefresh(event) {
    this.listProducts = [];
    this.listTimes = [];
    this.prayTime = await this.api.getToday();
    this.timesToday = await this.prayTime.datetime[0];
    this.parseTime(this.timesToday);
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.getAllProducts();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  listTimes:any = [];
  data:any = {};
  async parseTime(timesToday) {
    let times = Object.values(timesToday.times);
    let title = Object.keys(timesToday.times);
    let t = [];
    let tt = [];
    t = times.splice(1, 1);
    tt = title.splice(1, 1);
    t = times.splice(4, 1);
    tt = title.splice(4, 1);
    for(var i=0; i<times.length-1; i++) {
      this.data = {};
      let dt;
      await this.checkTime(times[i], times[i+1]).then(res => {
        return dt = res;
      });
      if(title[i] == 'Asr') {
        title[i] = 'Ashar';
      } else if(title[i] == 'Dhuhr') {
        title[i] = 'Dhuhur';
      } else if(title[i] == 'Fajr') {
        title[i] = 'Subuh';
      }
      if(dt == true) {
        this.data.title = title[i]; 
        this.data.time = times[i];
        this.data.title_color = 'primary'; 
        this.data.time_color = 'primary'; 
      } else {
        this.data.title = title[i]; 
        this.data.time = times[i];
        this.data.title_color = 'medium'; 
        this.data.time_color = 'dark'; 
      }
      this.listTimes.push(this.data);
    }
    
  }

  nextTime:any = {};
  nextTimeTimer:any;
  async checkTime(before, next) {
    let arr = [];
    let arr2 = [];
    let arr3 = [];
    let next_time = undefined;
    let before_time = undefined;
    let timeNow = undefined;
    let now = undefined;
    arr = before.split(':');
    arr2 = next.split(':');
    before_time = new Date(this.timesToday.date.gregorian).setHours(arr[0], arr[1], 0);
    next_time = new Date(this.timesToday.date.gregorian).setHours(arr2[0], arr2[1], 0);

    timeNow = this.datePipe.transform(new Date(), 'HH:mm:ss');
    arr3 = timeNow.split(':');
    now = new Date(this.timesToday.date.gregorian).setHours(Number(arr3[0]), Number(arr3[1]), Number(arr3[2]));
    if(new Date(now) >= new Date(before_time) && new Date(now) < new Date(next_time)) {
      let times = Object.values(this.timesToday.times);
      let title = Object.keys(this.timesToday.times);
      let idx = times.indexOf(next);
      if(title[idx] == 'Asr') {
        title[idx] = 'Ashar';
      } else if(title[idx] == 'Dhuhr') {
        title[idx] = 'Dhuhur';
      } else if(title[idx] == 'Fajr') {
        title[idx] = 'Subuh';
      } else if(title[idx] == 'Sunset') {
        title[idx] = 'Maghrib';
      }  
      this.nextTime.title = title[idx];
      if(title[idx] == 'Fajr') {
        let today = new Date(this.timesToday.date.gregorian);
        today.setDate(today.getDate() + 1);
        next_time = new Date(today).setHours(4, 10, 0);
        this.nextTime.time = new Date(next_time);
        this.nextTimeTimer = await this.timeCalc(this.dateNow, this.nextTime.time);
      } else {
        this.nextTime.time = new Date(next_time);
        this.nextTimeTimer = await this.timeCalc(this.dateNow, this.nextTime.time);
      }
      return true;
    } else {
      return false;
    }
  }

  timeCalc(d1, d2){
	
    let date1 = d1.getTime();
    let date2 = d2.getTime();

    let msec = date2 - date1;
    let mins = Math.floor(msec / 60000);
    let hrs = Math.floor(mins / 60);
    let days = Math.floor(hrs / 24);
    
    mins = mins % 60;

    let tValue1= `${hrs} Jam,  ${mins}  Menit`
 
    return tValue1;
  }

  async modalLogin() {
    const modal = await this.modalController.create({
      component: LoginPage,
      mode: "md",
    });
    return await modal.present();
  }

  getAllProducts() {
    this.api.get('products?limit=4').then(res => {
      this.parseImage(res);
    })
  }

  parseImage(res) {
    for(var i=0; i<res.length; i++) {
      let idx = this.listProducts.indexOf(res[i]);

      if(res[i].images != null && res[i].images != '') {
        res[i].images = JSON.parse(res[i].images);
        if(idx == -1) {
          this.listProducts.push(res[i]);
        }
      } else {
        res[i].images = [];
        if(idx == -1) {
          this.listProducts.push(res[i]);
        }
      }
    }
  }
}
