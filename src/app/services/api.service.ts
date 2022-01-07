import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from './common.service';
import { DatePipe } from '@angular/common';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  city:any = 'yogyakarta';
  constructor(
    public http:HttpClient,
    private common: CommonService,
    private datePipe: DatePipe,
    private geolocation: Geolocation,
    public modalController:ModalController,
    private diagnostic: Diagnostic,
    private platform: Platform,
    private loadingController: LoadingController,
    public alertController: AlertController,
  ) 
  { 
    this.checkPermission();
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
                    this.loadingCheckLoc();
                    this.checkLocation();
                  }
                }
              ]
            });
            await confirm.present();
          } else {
            console.log('ok');
            this.loadingCheckLoc();
            this.checkLocation();
          }
        }).catch(e => console.error(e));
    }
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
  locationNow:any;
  async getDetailLocation(dt) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(async res => {
      this.locationNow = res;
      this.city = this.locationNow.city.replace('Kota ', '');
      if(this.locationNow == undefined) {
        await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat +'&lon=' + dt.long, this.httpOption).subscribe(res => {
          this.locationNow = res;
          this.city = this.locationNow.city.replace('Kota ', '');
        })
      }
    }, async error => {
      await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
        this.locationNow = res;
        this.city = this.locationNow.city.replace('Kota ', '');
      })
    });
  }
  
  async get(url) {
    let dt = await this.common.get(url);
    return dt;
  }

  async post(url, data) {
    let dt = await this.common.post(url, data);
    return dt;
  }

  async put(url, data) {
    let dt = await this.common.put(url, data);
    return dt;
  }

  async delete(url) {
    let dt = await this.common.delete(url);
    return dt;
  }

  async me()
  { 
    let dt = await this.common.get('users/me');
    return dt;
  } 

  chatSeller(ownerData, detailProduct) {
    var url = 'https://api.whatsapp.com/send?phone=' + ownerData.phone +'&text=Halo%20admin%20salammu,%20saya%20tertarik%20dengan%20produk%20'+ detailProduct.name +'.'
    window.open(url, 'blank')
  }

  async getToday() {
    this.checkPermission();
    let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let data = await this.common.getTimes('timingsByCity?city='+ this.city + '&country=Indonesia' + '&method=1');
    return data;
  }

  async getThisWeek() {
    this.checkPermission();
    let data = await this.common.getWeekTimes('this_week.json?city='+ this.city +'&school=1');
    return data;
  }

  async getThisMonth(month, year) {
    this.checkPermission();
    if(month == 0) {
      month = 12
    }
    let data = await this.common.getTimes('calendarByCity?city='+ this.city + '&country=Indonesia' + '&method=1' + '&month='+month+'&year='+year);
    return data;
  }

  async getWeek(start,end) {
    this.checkPermission();
    let data = await this.common.getWeekTimes('dates.json?city='+ this.city + '&start=' + start + '&end=' + end +'&school=1');
    return data;
  }

  async getMonth(month) {
    this.checkPermission();
    let data = await this.common.getTimes('month.json?city='+ this.city + '&month=' + month +'&school=1');
    return data;
  }

}
