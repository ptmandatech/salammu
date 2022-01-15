import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CalendarService } from '../services/calendar.service';
import { ModalJadwalComponent } from './modal-jadwal/modal-jadwal.component';
import { CommonService } from '../services/common.service';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';

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
    public http:HttpClient, 
    private geolocation: Geolocation,
    public alertController: AlertController,
    private diagnostic: Diagnostic,
    private loadingController: LoadingController,
    private platform: Platform,
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
  dateToday:any;
  today:any;
  firstDateHeader:any;
  lastDateHeader:any;
  locationNow:any;
  city:any;
  loading:boolean;

  async ngOnInit() {
    this.daily = true;
    this.loading = true;
    this.checkPermission();
    let date = new Date();
    this.month = Number(this.datePipe.transform(new Date(date), 'MM'));
    this.dateToday = Number(this.datePipe.transform(new Date(date), 'dd'));
    this.today = this.datePipe.transform(new Date(date), 'dd MMM yyyy');
    this.year = date.getFullYear();
    this.prayTime = await this.api.getThisMonth(this.month,this.year, this.city);
  }

  checkPermission() {
    if (this.platform.is('android')) {
      let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
      let errorCallback = (e) => console.error(e);
      
      this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);
    
      this.diagnostic.isGpsLocationAvailable().then(successCallback, errorCallback);
    
      this.diagnostic.getLocationMode()
        .then(async (state) => {
          if (state == this.diagnostic.locationMode.LOCATION_OFF) {
            const confirm = await this.alertController.create({
              header: 'SalamMU',
              message: 'Lokasi belum diaktifkan di perangkat ini. Pergi ke pengaturan untuk mengaktifkan lokasi.',
              buttons: [
                {
                  text: 'Pengaturan',
                  handler: () => {
                    this.diagnostic.switchToLocationSettings();
                    this.checkLocation();
                  }
                }
              ]
            });
            await confirm.present();
          } else {
            console.log('ok');
            this.checkLocation();
          }
        }).catch(e => {
          this.getCurrentLocations();
          console.log(e)
        });
    } else {
      this.checkLocation();
    }
  }

  getCurrentLocations() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const location = {
        lat: resp.coords.latitude,
        long: resp.coords.longitude
      };
      this.getDetailLocation(location);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async loadingCheckLoc() {
    return await this.loadingController.create({
      spinner: 'crescent',
      message: 'Mengambil Data Lokasi...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
      });
    });
  }
  
  options:any;
  currentPos:any;
  checkLocation() {
    return new Promise((resolve, reject) => {
    this.options = {
      maximumAge: 3000,
      enableHighAccuracy: true
    };
   
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
      this.currentPos = pos;
      const location = {
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
        time: new Date(),
      };
      this.getDetailLocation(location);
      resolve(pos);
   }, (err: PositionError) => {
     reject(err.message);
    });
   });
  }

  httpOption:any;
  async getDetailLocation(dt) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat +'&lon=' + dt.long, this.httpOption).subscribe(async res => {
      this.locationNow = res;
      if(this.locationNow.address.state_district != undefined) {
        this.city = this.locationNow.address.state_district.replace('Kota ', '');
        this.getCal();
        this.dailyShow();
      } else {
        await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
          this.checkCity(res);
        })
      }
      if(this.locationNow == undefined) {
        await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
          this.checkCity(res);
        })
      }
    }, async error => {
      await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
        this.locationNow = res;
        this.city = this.locationNow.city.replace('Kota ', '');
        this.getCal();
        this.dailyShow();
      })
    });
  }

  checkCity(res) {
    this.locationNow = res.features[0].properties;
    this.city = res.features[0].properties.address.city;
    this.getCal();
    this.dailyShow();
  }

  getCal()
  {
    this.cal={};
  	var cal=this.calendar.today().data;
    this.selected=this.calendar.today().selected;
  	this.parseCal(cal);
  }

  m:any;
  n:any;
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
      if(cal[i].tanggal == this.dateToday) {
        this.cellSelected = cal[i];
      }
    }
    this.cal=res;
    this.week=Object.keys(res);

    for(var i=0; i<this.week.length;i++)
    {
      for(var j=0; j<this.cal[this.week[i]].length;j++)
      {
        if(this.cal[this.week[i]][j].tanggal == this.dateToday) {
          this.m = i.toString();
          this.n = j.toString();
          this.cellSelected={};
          this.cellSelected[this.m+this.n]=true;
        }
      }
    }
  }
  
  async next(from)
  {
      var cal=this.calendar.next(this.selected, from).data;
      this.selected=this.calendar.next(this.selected, from).selected;
      let date = new Date(this.selected);
      this.month = Number(this.datePipe.transform(new Date(date), 'MM'));
      this.year = date.getFullYear();
      this.parseCal(cal);
      if(from == 'weekly') {
        let date = new Date(this.timesSelected[this.timesSelected.length-1].date.gregorian);
        let start = this.datePipe.transform(new Date(date).setDate(date.getDate() + 1), 'yyyy-MM-dd');
        let end = this.datePipe.transform(new Date(date).setDate(date.getDate() + 7), 'yyyy-MM-dd');
        this.prayTime = await this.api.getWeek(start, end, this.city);
        // this.prayTime = await this.api.getThisMonth(this.month,this.year);
        this.timesSelected = await this.prayTime.datetime;
        this.firstDateHeader = this.timesSelected[0].date.gregorian;
        this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.gregorian;
        this.parseTime(this.timesSelected, 'weekly')
      } else if(from == 'monthly') {
        // let date = new Date(this.timesSelected[this.timesSelected.length-1].date.gregorian);
        // let month = this.datePipe.transform(new Date(date).setDate(date.getMonth() + 1), 'yyyy-MM');
        // this.prayTime = await this.api.getMonth(month);
        this.prayTime = await this.api.getThisMonth(this.month,this.year, this.city);
        this.timesSelected = await this.prayTime;
        this.parseTime(this.timesSelected, 'monthly');
        this.firstDateHeader = this.timesSelected[0].date.readable;
        this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.readable;
      }
  }

  async prev(from)
  {
      var cal=this.calendar.previous(this.selected, from).data;
      this.selected=this.calendar.previous(this.selected, from).selected;
      let date = new Date(this.selected);
      this.month = Number(this.datePipe.transform(new Date(date), 'MM'));
      this.year = date.getFullYear();
      this.parseCal(cal);
      if(from == 'weekly') {
        let date = new Date(this.timesSelected[0].date.gregorian);
        let start = this.datePipe.transform(new Date(date).setDate(date.getDate() - 7), 'yyyy-MM-dd');
        let end = this.datePipe.transform(new Date(date).setDate(date.getDate() - 1), 'yyyy-MM-dd');
        this.prayTime = await this.api.getWeek(start, end, this.city);
        // this.prayTime = await this.api.getThisMonth(this.month,this.year);
        this.timesSelected = await this.prayTime.datetime;
        this.firstDateHeader = this.timesSelected[0].date.gregorian;
        this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.gregorian;
        this.parseTime(this.timesSelected, 'weekly')
      } else if(from == 'monthly') {
        // let date = new Date(this.timesSelected[0].date.gregorian);
        // let month = this.datePipe.transform(new Date(date).setDate(date.getMonth() - 1), 'yyyy-MM');
        // this.prayTime = await this.api.getMonth(month);
        this.prayTime = await this.api.getThisMonth(this.month,this.year, this.city);
        this.timesSelected = await this.prayTime;
        this.firstDateHeader = this.timesSelected[0].date.readable;
        this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.readable;
        this.parseTime(this.timesSelected, 'monthly');
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

  async dailyShow() {
    this.timesSelected = [];
    this.daily =true;
    this.weekly =false;
    this.monthly =false;
    this.prayTime = await this.api.getThisMonth(this.month,this.year, this.city);
    this.timesSelected = await this.prayTime;
    this.loading = false;

  }

  async weeklyShow() {
    this.timesSelected = [];
    this.daily =false;
    this.weekly =true;
    this.monthly =false;
    let date = new Date();
    this.today = this.datePipe.transform(new Date(date), 'yyyy-MM-dd');
    this.month = Number(this.datePipe.transform(new Date(date), 'MM'));
    this.year = date.getFullYear();
    this.prayTime = await this.api.getThisWeek(this.city);
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
    let date = new Date();
    this.today = this.datePipe.transform(new Date(date), 'dd MMM yyyy');
    this.month = Number(this.datePipe.transform(new Date(date), 'MM'));
    this.year = date.getFullYear();
    this.prayTime = await this.api.getThisMonth(this.month,this.year, this.city);
    this.timesSelected = await this.prayTime;
    this.firstDateHeader = this.timesSelected[0].date.readable;
    this.lastDateHeader = this.timesSelected[this.timesSelected.length-1].date.readable;
    this.parseTime(this.timesSelected, 'monthly')

  }

  listTimes:any = [];
  tempTimes1:any = {};
  tempTimes2:any = {};
  data:any = {};
  times:any;
  title:any;
  async parseTime(timesSelected, from) {
    for(var i=0; i<timesSelected.length; i++) {
      this.timesSelected[i].timesParsed = [];
      this.tempTimes1[i] = [];
      this.tempTimes2[i] = [];
      if(from != 'weekly') {
        this.times = Object.values(timesSelected[i].timings);
        this.title = Object.keys(timesSelected[i].timings);
      } else {
        this.timesSelected[i].timings = timesSelected[i].times;
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
        if(this.data.title == 'Imsak') {
          this.tempTimes1[i].push(this.data);
        } else {
          this.tempTimes2[i].push(this.data);
        }
  
        this.timesSelected[i].timesParsed = this.tempTimes1[i].concat(this.tempTimes2[i]);
      }
    }
  }


}
