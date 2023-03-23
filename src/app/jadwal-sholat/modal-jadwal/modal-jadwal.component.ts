import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-modal-jadwal',
  templateUrl: './modal-jadwal.component.html',
  styleUrls: ['./modal-jadwal.component.scss'],
})
export class ModalJadwalComponent implements OnInit {

  dateSelected:any;
  times:any;
  timesToday:any;
  dateHijri:any = {};
  constructor(
    private calendar:CalendarService,
    public modalController: ModalController,
    private datePipe: DatePipe,
    public navParams: NavParams,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.dateSelected = this.navParams.get('data');
    this.times = this.navParams.get('times');
    this.timesToday = this.times.timings;
    
    this.dateHijri = this.navParams.get('dateHijri');
    this.parseTime(this.times)
  }

  listTimes:any = [];
  tempTimes1:any = [];
  tempTimes2:any = [];
  data:any = {};
  async parseTime(timesSelected) {
    let times = Object.values(timesSelected.timings);
    let title = Object.keys(timesSelected.timings);
    let t = [];
    let tt = [];
    t = times.splice(1, 1);
    tt = title.splice(1, 1);
    t = times.splice(4, 1);
    tt = title.splice(4, 1);
    
    
    for(var i=0; i<times.length-1; i++) {
      this.data = {};
      let dt;
      if(title[i] == 'Imsak') {
        await this.checkTime('00:01', times[i]).then(res => {
          return dt = res;
        });
      } else if(title[i] == 'Isha') {
        await this.checkTime(times[i], '23:59').then(res => {
          return dt = res;
        });
      } else {
        await this.checkTime(times[i], times[i+1]).then(res => {
          return dt = res;
        });
      }

      if(title[i] == 'Asr') {
        title[i] = 'Ashar';
      } else if(title[i] == 'Dhuhr') {
        title[i] = 'Dhuhur';
      } else if(title[i] == 'Fajr') {
        title[i] = 'Subuh';
      } else if(title[i] == 'Sunset') {
        title[i] = 'Maghrib';
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
      
      if(title[i] != "Firstthird" && title[i] != "Lastthird") {
        this.data.title = title[i]; 
        this.data.time = times[i];
      if(this.data.title == 'Imsak') {
        this.tempTimes1.push(this.data);
      } else {
        this.tempTimes2.push(this.data);
      }

      this.listTimes = this.tempTimes1.concat(this.tempTimes2);
      }
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
    before = before.replace(' (WIB)','');
    next = next.replace(' (WIB)','');
    arr = before.split(':');
    arr2 = next.split(':');
    before_time = new Date(this.times.date.readable).setHours(arr[0], arr[1], 0);
    next_time = new Date(this.times.date.readable).setHours(arr2[0], arr2[1], 0);

    timeNow = this.datePipe.transform(new Date(), 'HH:mm:ss');
    arr3 = timeNow.split(':');
    
    now = new Date(this.times.date.readable).setHours(Number(arr3[0]), Number(arr3[1]), Number(arr3[2]));
    let today = new Date();
    let dDay = this.datePipe.transform(new Date(now), 'dd/MM/yyyy');
    let tDay = this.datePipe.transform(today, 'dd/MM/yyyy');
    
    if(tDay == dDay && new Date(now) >= new Date(before_time) && new Date(now) < new Date(next_time)) {
      let times = Object.values(this.timesToday);
      let title = Object.keys(this.timesToday);
      let t = [];
      let tt = [];
      t = times.splice(4, 1);
      tt = title.splice(4, 1);
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
      if(title[idx] != undefined) {
        this.nextTime.title = title[idx];
      } else {
        this.nextTime.title = 'Midnight';
      }
      if(title[idx] == 'Fajr') {
        let today = new Date(this.times.date.readable);
        today.setDate(today.getDate() + 1);
        next_time = new Date(today).setHours(4, 10, 0);
        this.nextTime.time = undefined;
        this.nextTimeTimer = undefined;
        this.nextTime.time = new Date(next_time);
      } else {
        this.nextTime.time = undefined;
        this.nextTimeTimer = undefined;
        this.nextTime.time = new Date(next_time);
      }
      return true;
    } else {
      return false;
    }
  }

}
