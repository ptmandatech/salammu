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
  constructor(
    private calendar:CalendarService,
    public modalController: ModalController,
    public navParams: NavParams,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.dateSelected = this.navParams.get('data');
    this.times = this.navParams.get('times');
    this.parseTime(this.times)
  }

  listTimes:any = [];
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
      if(title[i] == 'Asr') {
        title[i] = 'Ashar';
      } else if(title[i] == 'Dhuhr') {
        title[i] = 'Dhuhur';
      } else if(title[i] == 'Fajr') {
        title[i] = 'Subuh';
      } else if(title[i] == 'Sunset') {
        title[i] = 'Maghrib';
      } 
      this.data.title = title[i]; 
      this.data.time = times[i];
      this.listTimes.push(this.data);
    }
    
  }

}
