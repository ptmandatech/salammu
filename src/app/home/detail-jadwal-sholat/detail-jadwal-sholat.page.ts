import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detail-jadwal-sholat',
  templateUrl: './detail-jadwal-sholat.page.html',
  styleUrls: ['./detail-jadwal-sholat.page.scss'],
})
export class DetailJadwalSholatPage implements OnInit {

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    private api: ApiService,
  ) { }

  listTimes:any = [];
  prayTime:any;
  city:any;
  nextTimeTimer:any;
  year:any;
  nextTime:any = {};
  ngOnInit() {
    this.prayTime = this.navParams.get('prayTime');
    this.listTimes = this.navParams.get('listTimes');
    console.log(this.listTimes);
    
    this.nextTimeTimer = this.navParams.get('nextTimeTimer');
    this.nextTime = this.navParams.get('nextTime');
    this.city = localStorage.getItem('selectedCity');
    this.year = new Date().getFullYear();
    if(this.nextTimeTimer) {
      this.checkCurrentTime();
    }
  }

  checkCurrentTime() {
    setInterval(async ()=> {
      let date = new Date();
      this.nextTimeTimer = await this.timeCalc(date, this.nextTime.time);
    },3000);
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

  setStatus(idx, status) {
    this.listTimes[idx].alarm = status;
    console.log(this.listTimes);
    
  }

}
