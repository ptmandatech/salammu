import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { LoginPage } from '../auth/login/login.page';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { SemuaMenuPage } from './semua-menu/semua-menu.page';
import { SettingLokasiPage } from './setting-lokasi/setting-lokasi.page';
import { PilihLokasiPage } from './pilih-lokasi/pilih-lokasi.page';
import { DetailJadwalSholatPage } from './detail-jadwal-sholat/detail-jadwal-sholat.page';

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

  sliderOption = {
    slidesPerView: 2,
    spaceBetween: 1,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  dateNow:any;
  listProducts:any = [];
  listBanners:any = [];
  serverImgBanner:any;
  serverImgArticles:any;
  serverImgProfil:any;
  serverImgVideos:any;
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
    private toastController: ToastController,
    private appComponent: AppComponent,
  ) {}

  prayTime:any = {};
  dataLogin:any = {};
  timesToday:any;
  async ngOnInit() {
    this.loading = true;
    this.present();
    this.surat = JSON.parse(localStorage.getItem('suratAlQuran'));
    if(this.surat == null) {
      this.getSurat();
    }
    this.listTimes = [];
    this.tempTimes1 = [];
    this.tempTimes2 = [];
    this.dateNow = new Date();
    await this.checkPermission();
    // this.getHijri(this.dateNow);
    this.cekLogin();
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.serverImgBanner = this.common.photoBaseUrl+'banners/';
    this.serverImgProfil = this.common.photoBaseUrl+'users/';
    this.serverImgArticles = this.common.photoBaseUrl+'articles/';
    this.serverImgVideos = this.common.photoBaseUrl+'videos/';
    this.getAllProducts();
    this.getAllBanners();
    this.getAllArticles();
    this.getAllVideos();
  }

  surat:any = [];
  suratTemp:any = [];
  getSurat() {
    this.loading = true;
    this.present();
    this.surat = [];
    this.suratTemp = [];
    this.api.get('quran/surat').then(res => {
      this.surat = res;
      this.suratTemp = res;
      localStorage.setItem('suratAlQuran', JSON.stringify(this.surat));
    })
  }

  async present() {
    return await this.loadingController.create({
      spinner: 'crescent',
      duration: 3000,
      message: 'Tunggu Sebentar...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
          this.loading = false;
        }
      });
      this.loading = false;
    });
  }

  dateHijri:any = {};
  getHijri(dateNow) {
    let tahun = this.datePipe.transform(dateNow, 'yyyy');
    let bulan = this.datePipe.transform(dateNow, 'MM');
    let tanggal = this.datePipe.transform(dateNow, 'dd');
    
    let data = {
      url: 'https://service.unisayogya.ac.id/kalender/api/masehi2hijriah/muhammadiyah/'+tahun+'/'+bulan+'/'+tanggal
    };

    this.api.post('dashboard/hijri', data).then(res => {
      this.dateHijri = res;
    })
  }

  async checkPermission() {
    if (this.platform.is('android')) {
      // let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
      // let errorCallback = async (e) => { console.error(e); await this.checkLocation()};

      // this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);

      // this.diagnostic.isGpsLocationAvailable().then(successCallback, errorCallback);

      this.diagnostic.getLocationMode()
        .then(async (state) => {
          if (state == this.diagnostic.locationMode.LOCATION_OFF) {
            const confirm = await this.alertController.create({
              header: 'SalamMU',
              message: 'Lokasi belum diaktifkan di perangkat ini. Pergi ke pengaturan untuk mengaktifkan lokasi.',
              buttons: [
                {
                  text: 'Pengaturan',
                  handler: async () => {
                    this.diagnostic.switchToLocationSettings();
                    await this.checkLocation();
                  }
                }
              ]
            });
            await confirm.present();
          } else {
            await this.checkLocation();
          }
        }).catch(async e => {
          await this.getCurrentLocations();
        });
    } else {
      await this.checkLocation();
    }
  }

  async getCurrentLocations() {
    let currentPos = JSON.parse(localStorage.getItem('currentPos'));
    let location;
    await this.geolocation.getCurrentPosition(this.options).then(async (pos: Geoposition) => {
      this.currentPos = pos;
      location = {
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
        time: new Date(),
      };
    }, (err: PositionError) => {
      this.openSettingLokasi();
    });

    if(currentPos == null) {
      localStorage.setItem('currentPos', JSON.stringify(location));
      let city = localStorage.getItem('selectedCity');
      if(city == null) {
        await this.getDetailLocation(location);
      } else {
        this.city = city;
        this.setTimeFromLocalCitySaved();
      }
    } else {
      if(currentPos.lat != location.lat && currentPos.long != location.long) {
        localStorage.setItem('currentPos', JSON.stringify(location));
        let city = localStorage.getItem('selectedCity');
        if(city == null) {
          await this.getDetailLocation(location);
        } else {
          this.city = city;
          this.setTimeFromLocalCitySaved();
        }
      } else {
        await this.getDetailLocation(currentPos);
      }
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
  async checkLocation() {
    this.listTimes = [];
    let currentPos = JSON.parse(localStorage.getItem('currentPos'));
    let location;
    await this.geolocation.getCurrentPosition(this.options).then(async (pos: Geoposition) => {
      this.currentPos = pos;
      location = {
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
        time: new Date(),
      };
    }, (err: PositionError) => {
      this.openSettingLokasi();
    });

    if(currentPos == null) {
      localStorage.setItem('currentPos', JSON.stringify(location));
      let city = localStorage.getItem('selectedCity');
      this.address_display_name = localStorage.getItem('address_display_name');
      if(city == null) {
        await this.getDetailLocation(location);
      } else {
        this.city = city;
        this.setTimeFromLocalCitySaved();
      }
    } else {
      if(currentPos.lat != location.lat && currentPos.long != location.long) {
        localStorage.setItem('currentPos', JSON.stringify(location));
        let city = localStorage.getItem('selectedCity');
        if(city == null) {
          await this.getDetailLocation(location);
        } else {
          this.city = city;
          this.setTimeFromLocalCitySaved();
        }
      } else {
        await this.getDetailLocation(currentPos);
      }
    }
  }

  async setTimeFromLocalCitySaved() {
    if(this.city != undefined) {
      this.listTimes = [];
      this.tempTimes1 = [];
      this.tempTimes2 = [];
      this.prayTime = undefined;
      this.timesToday = undefined;
      
      this.prayTime = await this.api.getToday(this.city).catch(async err => {
        const toast = await this.toastController.create({
          message: 'Gagal Mendapatkan informasi Jadwal Sholat, Silahkan refresh berkala.<br /> Error Message: '+err.error.message,
          duration: 2500,
          position: 'bottom',
          color: 'danger',
          mode: 'ios',
          cssClass: 'className'
        });
    
        await toast.present();
        return null;
      });
      if(this.prayTime) {
        this.timesToday = await this.prayTime.timings;
  
        if(this.timesToday['Firstthird']) {
          delete this.timesToday['Firstthird'];
          delete this.timesToday['Lastthird'];
        }
        if(this.timesToday['Sunrise']) {
          delete this.timesToday['Sunrise'];
        }
        this.parseTime(this.timesToday);
      }
    } else {
      this.openSettingLokasi();
    }
  }

  httpOption:any;
  address_display_name:any;
  async getDetailLocation(dt) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat +'&lon=' + dt.long, this.httpOption).subscribe(async res => {
    this.checkCity(res);
    }, async error => {
      await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(async res => {
        this.locationNow = res;
        
        if(res['name'] || res['display_name']) {
          this.address_display_name = res['name'] == null ? res['display_name']:res['name'];
        }
      
        this.city = this.locationNow.city.replace('Kota ', '');
        localStorage.setItem('selectedCity', this.city);
        localStorage.setItem('address_display_name', this.address_display_name);
        if(this.city != undefined) {
          this.listTimes = [];
          this.tempTimes1 = [];
          this.tempTimes2 = [];
          this.prayTime = undefined;
          this.timesToday = undefined;
          this.prayTime = await this.api.getToday(this.city).catch(async err => {
            const toast = await this.toastController.create({
              message: 'Gagal Mendapatkan informasi Jadwal Sholat, Silahkan refresh berkala.<br /> Error Message: '+err.error.message,
              duration: 2500,
              position: 'bottom',
              color: 'danger',
              mode: 'ios',
              cssClass: 'className'
            });
        
            await toast.present();
            return null;
          });
          if(this.prayTime) {
            this.timesToday = await this.prayTime.timings;
      
            if(this.timesToday['Firstthird']) {
              delete this.timesToday['Firstthird'];
              delete this.timesToday['Lastthird'];
            }
            if(this.timesToday['Sunrise']) {
              delete this.timesToday['Sunrise'];
            }
            this.parseTime(this.timesToday);
          }
        }
      }, async error => {
        this.openSettingLokasi();
        // this.city = 'Yogyakarta';
        // if(this.city != undefined) {
        //   this.listTimes = [];
        //   this.tempTimes1 = [];
        //   this.tempTimes2 = [];
        //   this.prayTime = undefined;
        //   this.timesToday = undefined;
        //   this.prayTime = await this.api.getToday(this.city);
        //   this.timesToday = await this.prayTime.timings;

        //   if(this.timesToday['Firstthird']) {
        //     delete this.timesToday['Firstthird'];
        //     delete this.timesToday['Lastthird'];
        //   }
        //   if(this.timesToday['Sunrise']) {
        //     delete this.timesToday['Sunrise'];
        //   }
        //   this.parseTime(this.timesToday);
        // }
      })
    });
  }

  async checkCity(res) {
    this.locationNow = res.features[0].properties;
    
    if(this.locationNow['name'] || this.locationNow['display_name']) {
      this.address_display_name = this.locationNow['name'] == null ? this.locationNow['display_name']:this.locationNow['name'];
    }
    this.city = res.features[0].properties.address.city == null ? res.features[0].properties.address.town == null ? res.features[0].properties.address.municipality:res.features[0].properties.address.town:res.features[0].properties.address.city;
    if(!this.city) {
      this.city = res.features[0].properties.address.city == null ? res.features[0].properties.address.county:res.features[0].properties.address.city;
    }
    localStorage.setItem('selectedCity', this.city);
    localStorage.setItem('address_display_name', this.address_display_name);
    if(this.city != undefined) {
      this.listTimes = [];
      this.tempTimes1 = [];
      this.tempTimes2 = [];
      this.prayTime = undefined;
      this.timesToday = undefined;
      this.prayTime = await this.api.getToday(this.city).catch(async err => {
        const toast = await this.toastController.create({
          message: 'Gagal Mendapatkan informasi Jadwal Sholat, Silahkan refresh berkala.<br /> Error Message: '+err.error.message,
          duration: 2500,
          position: 'bottom',
          color: 'danger',
          mode: 'ios',
          cssClass: 'className'
        });
    
        await toast.present();
        return null;
      });
      if(this.prayTime) {
        this.timesToday = await this.prayTime.timings;
  
        if(this.timesToday['Firstthird']) {
          delete this.timesToday['Firstthird'];
          delete this.timesToday['Lastthird'];
        }
        if(this.timesToday['Sunrise']) {
          delete this.timesToday['Sunrise'];
        }
        this.parseTime(this.timesToday);
      }
    } else {
      this.openSettingLokasi();
    }
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

  isLoggedIn:boolean = false;
  isVisible:boolean = false;
  async cekLogin()
  {
    this.dataLogin = await JSON.parse(localStorage.getItem('salammuToken'));
    this.api.me().then(async res=>{
      this.userData = res;
      this.isLoggedIn = true;
      if(this.dataLogin.cabang_id || this.dataLogin.ranting_id) {
        this.isVisible = true;
      }
      await this.loadingController.dismiss();
    }, async error => {
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.userData = undefined;
      this.isLoggedIn = false;
      this.isVisible = false;
      await this.loadingController.dismiss();
    })
  }

  async doRefresh(event) {
    if(this.appComponent.networkStatus){
      if(this.appComponent.networkStatus.connected == true) {
        this.loading = true;
        this.listProducts = [];
        this.listBanners = [];
        this.listVideos = [];
        this.listArticles = [];
        this.listTimes = [];
        this.tempTimes1 = [];
        this.tempTimes2 = [];
        this.prayTime = undefined;
        this.timesToday = undefined;
        this.nextTime = {};
        this.nextTimeTimer = undefined;
        await this.checkPermission();
        this.cekLogin();
        this.dateNow = new Date();
        this.getHijri(this.dateNow);
        this.serverImg = this.common.photoBaseUrl+'products/';
        this.serverImgBanner = this.common.photoBaseUrl+'banners/';
        this.getAllProducts();
        this.getAllBanners();
        this.getAllArticles();
        this.getAllVideos();
        setTimeout(() => {
          event.target.complete();
        }, 2000);
      } else {
        this.appComponent.cekKoneksi();
        setTimeout(() => {
          event.target.complete();
        }, 2000);
      }
    } else {
      this.appComponent.cekKoneksi();
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }
  }

  listArticles:any = [];
  getAllArticles() {
    this.api.get('articles?limit=5').then(res => {
      this.listArticles = res;
    }, error => {
    })
  }

  listVideos:any = [];
  getAllVideos() {
    this.api.get('videos?limit=5').then(res => {
      this.listVideos = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  getAllBanners() {
    this.api.get('banners').then(res => {
      this.listBanners = res;
    })
  }

  listTimes:any = [];
  tempTimes1:any = [];
  tempTimes2:any = [];
  data:any = {};
  async parseTime(timesToday) {
    this.listTimes = [];
    this.tempTimes1 = [];
    this.tempTimes2 = [];
    let times = Object.values(timesToday);
    let title = Object.keys(timesToday);
    let t = [];
    let tt = [];
    t = times.splice(4, 1);
    tt = title.splice(4, 1);

    let idxFajr = title.findIndex(e => e == 'Fajr');

    for(var i=0; i<times.length-1; i++) {
      this.data = {};
      let dt;
      if(title[i] == 'Imsak') {
        await this.checkTime('00:01', times[idxFajr]).then(res => {
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
      this.data.alarm = 'on';
      if(this.data.title == 'Imsak') {
        let idx = this.tempTimes1.indexOf(this.data);
        if(idx == -1) {
          this.tempTimes1.push(this.data);
        }
      } else {
        let idx = this.tempTimes2.indexOf(this.data);
        if(idx == -1) {
          this.tempTimes2.push(this.data);
        }
      }

      if(this.data.alarm = 'on') {
        // console.log('masuk sini buat set schedule alarm ', this.data);
        // var hours = this.data.time.split(":")[0];
        // var minutes = this.data.time.split(":")[1];
        // console.log(hours);
        // console.log(minutes);
        
        
        // const date = new Date();
        // date.setHours(hours);
        // date.setMinutes(minutes);
        
        // let randomId = Math.floor(Math.random() * 10000) + 1;
        // const notifs = await LocalNotifications.schedule({notifications: [{
        //   title: this.data.title,
        //   body: 'SalamMU - '+this.data.time,
        //   id: randomId,
        //   schedule: {
        //     at : date,
        //     allowWhileIdle: true
        //   },
        // }]})
        // console.log('scheduled notifications', notifs);
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
        let date = new Date();
        this.nextTimeTimer = await this.timeCalc(date, this.nextTime.time);
        this.checkCurrentTime();
      } else {
        this.nextTime.time = undefined;
        this.nextTimeTimer = undefined;
        this.nextTime.time = new Date(next_time);
        let date = new Date();
        this.nextTimeTimer = await this.timeCalc(date, this.nextTime.time);
        this.checkCurrentTime();
      }
      return true;
    } else {
      return false;
    }
  }

  checkCurrentTime() {
    setInterval(async ()=> {
      let date = new Date();
      this.nextTimeTimer = await this.timeCalc(date, this.nextTime.time);
      if(this.nextTimeTimer.includes('-') || this.nextTimeTimer.includes('NaN')) {
        this.listTimes = [];
        this.tempTimes1 = [];
        this.tempTimes2 = [];
        this.nextTime = {};
        this.nextTimeTimer = null;
        this.parseTime(this.timesToday);
      }
    },1000);
  }

  timeCalc(d1, d2){
    let date1 = d1.getTime();
    let date2 = d2.getTime();

    let msec = date2 - date1;
    let sec = Math.floor(msec / 1000);
    var seconds = ((msec % 60000) / 1000).toFixed(0);
    let mins = Math.floor(msec / 60000);
    let hrs = Math.floor(mins / 60);
    let days = Math.floor(hrs / 24);

    mins = mins % 60;

    let tValue1= `${hrs} Jam, ${mins} Menit, ${seconds} Detik`

    return tValue1;
  }

  async modalLogin() {
    await this.cekLogin();
    let userData = JSON.parse(localStorage.getItem('salammuToken'));
    if(userData == undefined) {
      const modal = await this.modalController.create({
        component: LoginPage,
        mode: "md",
      });
      modal.onDidDismiss().then(async res => {
        this.userData = undefined;
        this.cekLogin();
      })
      return await modal.present();
    } else {
      this.router.navigate(['/profil']);
    }
  }

  getAllProducts() {
    this.api.get('products?getBy=fav').then(res => {
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

  //Modal Semua Menu
  async allMenu() {
    const modal = await this.modalController.create({
      component: SemuaMenuPage,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 1]
    });
    return await modal.present();
  }

  //Modal Setting Lokasi
  async openSettingLokasi() {
    const modal = await this.modalController.create({
      component: SettingLokasiPage,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.3,
      breakpoints: [0, 0.3, 1]
    });

    modal.onDidDismiss().then(async (result) => {
      if(result['data'] == 'lokasisekarang') {
        this.present();
        await this.checkPermission();
      } else if(result['data'] == 'cari') {
        this.openLocations();
      }
    });
    return await modal.present();
  }

  //detail jadwal sholat
  async detailJadwal() {
    if(this.prayTime && this.listTimes && this.nextTimeTimer && this.nextTime) {
      const modal = await this.modalController.create({
        component: DetailJadwalSholatPage,
        componentProps: {
          prayTime: this.prayTime,
          listTimes: this.listTimes,
          nextTimeTimer: this.nextTimeTimer,
          nextTime: this.nextTime
        },
        mode: "md",
        cssClass: 'modal-class',
        initialBreakpoint: 0.99,
        breakpoints: [0, 0.99, 1]
      });
  
      modal.onDidDismiss().then(async (result) => {
        console.log(result);
      });
      return await modal.present();
    }
  }

  //Modal Pilih Lokasi
  async openLocations() {
    const modal = await this.modalController.create({
      component: PilihLokasiPage,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8, 1]
    });

    modal.onDidDismiss().then(async (result) => {
      if(result['data']) {
        this.city = result['data']['kab_nama'];
        localStorage.setItem('selectedCity', this.city);
        if(this.city != undefined) {
          this.listTimes = [];
          this.tempTimes1 = [];
          this.tempTimes2 = [];
          this.prayTime = undefined;
          this.timesToday = undefined;
          this.prayTime = await this.api.getToday(this.city).catch(async err => {
            const toast = await this.toastController.create({
              message: 'Gagal Mendapatkan informasi Jadwal Sholat, Silahkan refresh berkala.<br /> Error Message: '+err.error.message,
              duration: 2500,
              position: 'bottom',
              color: 'danger',
              mode: 'ios',
              cssClass: 'className'
            });
        
            await toast.present();
            return null;
          });
          if(this.prayTime) {
            this.timesToday = await this.prayTime.timings;
      
            if(this.timesToday['Firstthird']) {
              delete this.timesToday['Firstthird'];
              delete this.timesToday['Lastthird'];
            }
            if(this.timesToday['Sunrise']) {
              delete this.timesToday['Sunrise'];
            }
            this.parseTime(this.timesToday);
          }
        }
      }
    });
    return await modal.present();
  }
}
