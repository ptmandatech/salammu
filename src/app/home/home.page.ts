import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { LoginPage } from '../auth/login/login.page';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  listBanners:any = [];
  serverImgBanner:any;
  serverImg: any;
  userData: any;
  locationNow:any;
  city:any;
  loading:boolean;
  constructor(
    public common: CommonService,
    public http:HttpClient, 
    private api: ApiService,
    private loadingController: LoadingController,
    private datePipe: DatePipe,
    public modalController: ModalController,
    private router: Router,
    private geolocation: Geolocation,
    public alertController: AlertController,
    private diagnostic: Diagnostic,
    private platform: Platform,
  ) {}

  prayTime:any;
  timesToday:any;
  async ngOnInit() {
    this.loading = true;
    this.dateNow = new Date();
    await this.checkPermission();
    this.cekLogin();
    this.prayTime = undefined;
    this.timesToday = undefined;
    this.prayTime = await this.api.getToday(this.city);
    console.log(this.prayTime)
    this.timesToday = await this.prayTime.timings;
    
    this.parseTime(this.timesToday);
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.serverImgBanner = this.common.photoBaseUrl+'banners/';
    this.getAllProducts();
    this.getAllBanners();
  }

  ionViewWillEnter() {
    this.checkPermission();
    this.cekLogin();
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
      })
    });
  }

  checkCity(res) {
    this.locationNow = res.features[0].properties;
    this.city = res.features[0].properties.address.city;
  }

  // async loginStatus() {
  //   this.loading = true;
  //   return await this.loadingController.create({
  //     spinner: 'crescent',
  //     message: 'Mohon Tunggu...',
  //     cssClass: 'custom-class custom-loading'
  //   }).then(a => {
  //     a.present().then(() => {
  //       console.log('presented');
  //       this.cekLogin();
  //     });
  //     this.loading = false;
  //   });
  // }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      await this.loadingController.dismiss();
    }, async error => {
      this.loading = false;
      await this.loadingController.dismiss();
    })
  }

  async doRefresh(event) {
    this.loading = true;
    this.listProducts = [];
    this.listBanners = [];
    this.listTimes = [];
    this.tempTimes1 = [];
    this.tempTimes2 = [];
    this.prayTime = undefined;
    this.timesToday = undefined;
    await this.checkPermission();
    this.prayTime = await this.api.getToday(this.city);
    this.timesToday = await this.prayTime.timings;
    this.parseTime(this.timesToday);
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.serverImgBanner = this.common.photoBaseUrl+'banners/';
    this.getAllProducts();
    this.getAllBanners();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllBanners() {
    this.api.get('banners').then(res => {
      this.listBanners = res;
      this.loading = false;
    })
  }

  listTimes:any = [];
  tempTimes1:any = [];
  tempTimes2:any = [];
  data:any = {};
  async parseTime(timesToday) {
    let times = Object.values(timesToday);
    let title = Object.keys(timesToday);
    let t = [];
    let tt = [];
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
      if(this.data.title == 'Imsak') {
        this.tempTimes1.push(this.data);
      } else {
        this.tempTimes2.push(this.data);
      }

      this.listTimes = this.tempTimes1.concat(this.tempTimes2);
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
    before_time = new Date(this.prayTime.date.readable).setHours(arr[0], arr[1], 0);
    next_time = new Date(this.prayTime.date.readable).setHours(arr2[0], arr2[1], 0);

    timeNow = this.datePipe.transform(new Date(), 'HH:mm:ss');
    arr3 = timeNow.split(':');
    now = new Date(this.prayTime.date.readable).setHours(Number(arr3[0]), Number(arr3[1]), Number(arr3[2]));
    if(new Date(now) >= new Date(before_time) && new Date(now) < new Date(next_time)) {
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
        let today = new Date(this.prayTime.date.readable);
        today.setDate(today.getDate() + 1);
        next_time = new Date(today).setHours(4, 10, 0);
        this.nextTime.time = undefined;
        this.nextTimeTimer = undefined;
        this.nextTime.time = new Date(next_time);
        this.nextTimeTimer = await this.timeCalc(this.dateNow, this.nextTime.time);
      } else {
        this.nextTime.time = undefined;
        this.nextTimeTimer = undefined;
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
    if(this.userData == undefined) {
      const modal = await this.modalController.create({
        component: LoginPage,
        mode: "md",
      });
      return await modal.present();
    } else {
      this.router.navigate(['/profil']);
    }
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
    this.loading = false;
  }
}
