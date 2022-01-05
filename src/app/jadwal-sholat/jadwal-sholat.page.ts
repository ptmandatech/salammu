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
  month:any;
  year:any;
  firstDateHeader:any;
  lastDateHeader:any;

  async ngOnInit() {
    this.getCal();
    this.dailyShow();
    let date = new Date();
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.prayTime = await this.api.getThisMonth(this.month,this.year);
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
      let date = new Date(this.selected);
      this.month = date.getMonth();
      this.year = date.getFullYear();
      this.parseCal(cal);
      if(from == 'weekly') {
        let date = new Date(this.timesSelected[this.timesSelected.length-1].date.gregorian);
        let start = this.datePipe.transform(new Date(date).setDate(date.getDate() + 1), 'yyyy-MM-dd');
        let end = this.datePipe.transform(new Date(date).setDate(date.getDate() + 7), 'yyyy-MM-dd');
        this.prayTime = await this.api.getWeek(start, end);
        // this.prayTime = await this.api.getThisMonth(this.month,this.year);
        this.timesSelected = await this.prayTime.datetime;
        this.firstDateHeader = this.timesSelected[0].date.gregorian;
        this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.gregorian;
        this.parseTime(this.timesSelected, 'weekly')
      } else if(from == 'monthly') {
        // let date = new Date(this.timesSelected[this.timesSelected.length-1].date.gregorian);
        // let month = this.datePipe.transform(new Date(date).setDate(date.getMonth() + 1), 'yyyy-MM');
        // this.prayTime = await this.api.getMonth(month);
        this.prayTime = await this.api.getThisMonth(this.month,this.year);
        this.timesSelected = await this.prayTime;
        this.parseTime(this.timesSelected, 'monthly')
        this.firstDateHeader = this.timesSelected[0].date.readable;
        this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.readable;
      }
  }

  async prev(from)
  {
      var cal=this.calendar.previous(this.selected, from).data;
      this.selected=this.calendar.previous(this.selected, from).selected;
      let date = new Date(this.selected);
      this.month = date.getMonth();
      this.year = date.getFullYear();
      this.parseCal(cal);
      if(from == 'weekly') {
        let date = new Date(this.timesSelected[0].date.gregorian);
        let start = this.datePipe.transform(new Date(date).setDate(date.getDate() - 7), 'yyyy-MM-dd');
        let end = this.datePipe.transform(new Date(date).setDate(date.getDate() - 1), 'yyyy-MM-dd');
        this.prayTime = await this.api.getWeek(start, end);
        // this.prayTime = await this.api.getThisMonth(this.month,this.year);
        this.timesSelected = await this.prayTime.datetime;
        this.firstDateHeader = this.timesSelected[0].date.gregorian;
        this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.gregorian;
        this.parseTime(this.timesSelected, 'weekly')
      } else if(from == 'monthly') {
        // let date = new Date(this.timesSelected[0].date.gregorian);
        // let month = this.datePipe.transform(new Date(date).setDate(date.getMonth() - 1), 'yyyy-MM');
        // this.prayTime = await this.api.getMonth(month);
        this.prayTime = await this.api.getThisMonth(this.month,this.year);
        this.timesSelected = await this.prayTime;
        this.firstDateHeader = this.timesSelected[0].date.readable;
        this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.readable;
        this.parseTime(this.timesSelected, 'monthly')
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
        times: this.prayTime[time-1]
      }
    });
    return await modal.present();
  }

  dailyShow() {
    this.timesSelected = [];
    this.daily =true;
    this.weekly =false;
    this.monthly =false;

  }

  async weeklyShow() {
    this.timesSelected = [];
    this.daily =false;
    this.weekly =true;
    this.monthly =false;
    this.prayTime = await this.api.getThisWeek();
    this.timesSelected = await this.prayTime.datetime;
    this.firstDateHeader = this.timesSelected[0].date.gregorian;
    this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.gregorian;
    this.parseTime(this.timesSelected, 'weekly')

  }

  async monthlyShow() {
    this.timesSelected = [];
    this.daily =false;
    this.weekly =false;
    this.monthly =true;
    this.prayTime = await this.api.getThisMonth(this.month,this.year);
    this.timesSelected = await this.prayTime;
    this.firstDateHeader = this.timesSelected[0].date.readable;
    this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.readable;
    this.parseTime(this.timesSelected, 'monthly')

  }

  listTimes:any = [];
  data:any = {};
  times:any;
  title:any;
  async parseTime(timesSelected, from) {
    for(var i=0; i<timesSelected.length; i++) {
      this.timesSelected[i].timesParsed = [];
      if(from != 'weekly') {
        this.times = Object.values(timesSelected[i].timings);
        this.title = Object.keys(timesSelected[i].timings);
      } else {
        this.times = Object.values(timesSelected[i].times);
        this.title = Object.keys(timesSelected[i].times);
      }
      let t = [];
      let tt = [];
      t = this.times.splice(1, 1);
      tt = this.title.splice(1, 1);
      t = this.times.splice(4, 1);
      tt = this.title.splice(4, 1);
      for(var j=0; j<this.times.length-1; j++) {
        this.data = {};
        if(this.title[j] == 'Asr') {
          this.title[j] = 'Ashar';
        } else if(this.title[j] == 'Dhuhr') {
          this.title[j] = 'Dhuhur';
        } else if(this.title[j] == 'Fajr') {
          this.title[j] = 'Subuh';
        } else if(this.title[j] == 'Sunset') {
          this.title[j] = 'Maghrib';
        } 
        this.data.title = this.title[j]; 
        this.data.time = this.times[j];
        this.timesSelected[i].timesParsed.push(this.data);
      }
    }
  }


}
