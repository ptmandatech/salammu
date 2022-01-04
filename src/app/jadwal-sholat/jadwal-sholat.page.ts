import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CalendarService } from '../services/calendar.service';
import { ModalJadwalComponent } from './modal-jadwal/modal-jadwal.component';

@Component({
  selector: 'app-jadwal-sholat',
  templateUrl: './jadwal-sholat.page.html',
  styleUrls: ['./jadwal-sholat.page.scss'],
})
export class JadwalSholatPage implements OnInit {

  constructor(
    private calendar:CalendarService,
    public modalController: ModalController,
    private api: ApiService,
    private datePipe: DatePipe,
  ) { }

  cal:any={};
  week:any=[];
  selected:any;
  daily:boolean;
  weekly:boolean;
  monthly:boolean;
  prayTime:any = [];
  timesSelected:any;

  async ngOnInit() {
    this.getCal();
    this.dailyShow();
    this.prayTime = await this.api.getThisMonth();
    console.log(this.prayTime)
  }


  getCal()
  {
    this.cal={};
  	var cal=this.calendar.today().data;
    this.selected=this.calendar.today().selected;
  	this.parseCal(cal);
  }
  parseCal(cal)
  {
    var res={};
    for(var i=0; i<cal.length;i++)
    {
      var key=Math.floor(i/7);
      if(res[key]==undefined)
      {
        res[key]=[cal[i]];
      }else{
        res[key].push(cal[i]);
      }
    }
    this.cal=res;
    this.week=Object.keys(res);
  }
  async next(from)
  {
      var cal=this.calendar.next(this.selected, from).data;
      this.selected=this.calendar.next(this.selected, from).selected;
      this.parseCal(cal);
      if(from == 'weekly') {
        let date = new Date(this.timesSelected[this.timesSelected.length-1].date.gregorian);
        let start = this.datePipe.transform(new Date(date).setDate(date.getDate() + 1), 'yyyy-MM-dd');
        let end = this.datePipe.transform(new Date(date).setDate(date.getDate() + 7), 'yyyy-MM-dd');
        this.prayTime = await this.api.getWeek(start, end);
        this.timesSelected = await this.prayTime.datetime;
        this.parseTime(this.timesSelected)
      } else if(from == 'monthly') {
        let date = new Date(this.timesSelected[this.timesSelected.length-1].date.gregorian);
        let month = this.datePipe.transform(new Date(date).setDate(date.getMonth() + 1), 'yyyy-MM');
        this.prayTime = await this.api.getMonth(month);
        this.timesSelected = await this.prayTime.datetime;
        this.parseTime(this.timesSelected)
      }
  }

  async prev(from)
  {
      var cal=this.calendar.previous(this.selected, from).data;
      this.selected=this.calendar.previous(this.selected, from).selected;
      this.parseCal(cal);
      if(from == 'weekly') {
        let date = new Date(this.timesSelected[0].date.gregorian);
        let start = this.datePipe.transform(new Date(date).setDate(date.getDate() - 7), 'yyyy-MM-dd');
        let end = this.datePipe.transform(new Date(date).setDate(date.getDate() - 1), 'yyyy-MM-dd');
        this.prayTime = await this.api.getWeek(start, end);
        this.timesSelected = await this.prayTime.datetime;
        this.parseTime(this.timesSelected)
      } else if(from == 'monthly') {
        let date = new Date(this.timesSelected[0].date.gregorian);
        let month = this.datePipe.transform(new Date(date).setDate(date.getMonth() - 1), 'yyyy-MM');
        this.prayTime = await this.api.getMonth(month);
        this.timesSelected = await this.prayTime.datetime;
        this.parseTime(this.timesSelected)
      }
  }

  //pilih cell
  cellSelected:any={};
  selectCell(m,n)
  {
     this.cellSelected={};
     this.cellSelected[m+n]=true;
     var date=this.cal[m][n];
     this.selected=new Date(date.tahun,date.bulan-1,date.tanggal);
     this.presentModal(this.selected);
  }

  async presentModal(selected) {
    const time = selected.getDate();
    const modal = await this.modalController.create({
      component: ModalJadwalComponent,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      componentProps: {
        data:selected,
        times: this.prayTime.datetime[time-1]
      }
    });
    return await modal.present();
  }

  dailyShow() {

    this.daily =true;
    this.weekly =false;
    this.monthly =false;

  }

  async weeklyShow() {

    this.daily =false;
    this.weekly =true;
    this.monthly =false;
    this.prayTime = await this.api.getThisWeek();
    this.timesSelected = await this.prayTime.datetime;
    this.parseTime(this.timesSelected)

  }

  async monthlyShow() {

    this.daily =false;
    this.weekly =false;
    this.monthly =true;
    this.prayTime = await this.api.getThisMonth();
    this.timesSelected = await this.prayTime.datetime;
    console.log(this.timesSelected)
    this.parseTime(this.timesSelected)

  }

  listTimes:any = [];
  data:any = {};
  async parseTime(timesSelected) {
    for(var i=0; i<timesSelected.length; i++) {
      this.timesSelected[i].timesParsed = [];
      let times = Object.values(timesSelected[i].times);
      let title = Object.keys(timesSelected[i].times);
      let t = [];
      let tt = [];
      t = times.splice(1, 1);
      tt = title.splice(1, 1);
      t = times.splice(4, 1);
      tt = title.splice(4, 1);
      for(var j=0; j<times.length-1; j++) {
        this.data = {};
        if(title[j] == 'Asr') {
          title[j] = 'Ashar';
        } else if(title[j] == 'Dhuhr') {
          title[j] = 'Dhuhur';
        } else if(title[j] == 'Fajr') {
          title[j] = 'Subuh';
        }
        this.data.title = title[j]; 
        this.data.time = times[j];
        this.timesSelected[i].timesParsed.push(this.data);
      }
    }
    
  }


}
