import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { CalendarService } from '../services/calendar.service';
import { ModalKalenderComponent } from './modal-kalender/modal-kalender.component';
import { ModalPetaComponent } from './modal-peta/modal-peta.component';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

//map
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {useGeographic} from 'ol/proj';
import Layer from 'ol/layer/Layer';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import PluggableMap from 'ol/PluggableMap';
import TileWMS from 'ol/source/TileWMS';
import Geocoder from 'ol-geocoder';
useGeographic();

@Component({
  selector: 'app-pengajian',
  templateUrl: './pengajian.page.html',
  styleUrls: ['./pengajian.page.scss'],
})
export class PengajianPage implements OnInit {

  defaultSegment:any='kalender';
  cal:any={};
  week:any=[];
  selected:any;
  dateToday:any;
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef;
  mapPengajian: Map;
  loadingGetMap:boolean;
  userData:any;
  month:any;
  year:any;
  today:any;
  city:any;
  prayTime:any = [];
  locationNow:any;

  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    private datePipe: DatePipe,
    private geolocation: Geolocation,
    private calendar:CalendarService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public http:HttpClient, 
    public alertController: AlertController,
    private diagnostic: Diagnostic,
    private loadingController: LoadingController,
    private platform: Platform,
  ) { }

  async ngOnInit() {
    this.loadingGetMap = true;
    this.present();
    this.checkPermission();
    this.cekLogin();
    this.getAllPengajian();
    this.getPengajian();
    let date = new Date();
    this.dateToday = Number(this.datePipe.transform(new Date(date), 'dd'));
    this.month = Number(this.datePipe.transform(new Date(date), 'MM'));
    this.today = this.datePipe.transform(new Date(date), 'dd MMM yyyy');
    this.year = date.getFullYear();
    this.prayTime = await this.api.getThisMonth(this.month,this.year, this.city);
  }

  async present() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      duration: 10000,
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
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
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
      })
    });
  }

  checkCity(res) {
    this.locationNow = res.features[0].properties;
    this.city = res.features[0].properties.address.city;
    this.getCal();
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      this.getCurrentLocations();
    }, async error => {
      this.getCurrentLocations();
      this.loading = false;
    })
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
  async parseCal(cal)
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

    for(var i=0; i<this.week.length;i++)
    {
      for(var j=0; j<this.cal[this.week[i]].length;j++)
      {
        if(this.cal[this.week[i]][j] != 0) {
          let tahun = this.cal[this.week[i]][j].tahun;
          let bulan = this.cal[this.week[i]][j].bulan;
          let tanggal = this.cal[this.week[i]][j].tanggal;
          let datetime = this.datePipe.transform(new Date(tahun, bulan-1, tanggal), 'yyyy-MM-dd');
          await this.parseDataPengajian(datetime, this.cal[this.week[i]][j].tanggal);
        }

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
      this.dataPengajian = {};
      var cal=this.calendar.next(this.selected, from).data;
      this.selected=this.calendar.next(this.selected, from).selected;
      let date = new Date(this.selected);
      this.month = Number(this.datePipe.transform(new Date(date), 'MM'));
      this.year = date.getFullYear();
      this.prayTime = undefined;
      this.prayTime = await this.api.getThisMonth(this.month,this.year, this.city);
      this.parseCal(cal);
  }
  async prev(from)
  {
    this.dataPengajian = {};
      var cal=this.calendar.previous(this.selected, from).data;
      this.selected=this.calendar.previous(this.selected, from).selected;
      let date = new Date(this.selected);
      this.month = Number(this.datePipe.transform(new Date(date), 'MM'));
      this.year = date.getFullYear();
      this.prayTime = undefined;
      this.prayTime = await this.api.getThisMonth(this.month,this.year, this.city);
      this.parseCal(cal);
  }

  //pilih cell
  cellSelected:any={};
  selectCell(m,n)
  {
     var date=this.cal[m][n];
     if(date != 0) {
      this.cellSelected={};
      this.cellSelected[m+n]=true;
      this.selected=new Date(date.tahun,date.bulan-1,date.tanggal);
      this.dateToday = date.tanggal;
      this.modalKelander(this.selected);
     }
  }

  dataPengajian:any = {};
  pengajian:any = [];
  getPengajian() {
    this.api.get('pengajian?all=ok').then(res => {
      this.pengajian = res;
    }, error => {
      this.loading = false;
    })
  }

  parseDataPengajian(datetime, date) {
    for(var i=0; i<this.pengajian.length; i++) {
      let dt = this.datePipe.transform(new Date(this.pengajian[i].datetime), 'yyyy-MM-dd');
      if(dt == datetime) {
        if(this.dataPengajian[date] == undefined) {
          this.dataPengajian[date] = [];
        }
        let idx = this.dataPengajian[date].indexOf(this.pengajian[i]);
        if(idx == -1) {
          this.dataPengajian[date].push(this.pengajian[i]);
        }
      }
    }
  }

  //Modal Kalender
  async modalKelander(selected) {
    const time = selected.getDate();
    const modal = await this.modalController.create({
      component: ModalKalenderComponent,
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

  async modalPeta(dataPengajian) {
    const modal = await this.modalController.create({
      component: ModalPetaComponent,
      componentProps: {data:dataPengajian},
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
    });
    return await modal.present();
  }

  listPengajian:any = [];
  listPengajianTemp:any = [];
  loading:boolean;
  getAllPengajian() {
    this.listPengajian = [];
    this.listPengajianTemp = [];
    this.api.get('pengajian?all=ok').then(res => {
      this.listPengajian = res;
      this.listPengajianTemp = res;
      this.loading = false;
      this.generateMap();
    }, error => {
      this.generateMap();
      this.loading = false;
    })
  }

  longitude:any;
  latitude:any;
  marker: Feature;
  vectorSource: VectorSource;
  vectorLayer: VectorLayer;
  height:any='300px';
  showToolbar:boolean=false;
  title:any = 'SalamMU';
  center:any=[110.3647,-7.8014];
  async generateMap()
  {
    this.loadingGetMap = true;
    var features = [];
    for(var i=0; i<this.listPengajian.length; i++) {
      if(this.listPengajian[i].pin != null) {
        let pin = JSON.parse(this.listPengajian[i].pin);
        await features.push(coloredSvgMarker([pin.long, pin.lat], this.listPengajian[i].name, this.listPengajian[i].id, "red"));
      }
    }

    this.vectorSource = new VectorSource({
      features: features 
    });
    
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.mapPengajian = new Map({
      target: 'mapPengajian',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      view: new View({
        center: [this.longitude, this.latitude],
        zoom: 14 
      }),
      style: new Style({
        image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png',
          scale: 0.5
        }))
      })
    });
    this.mapPengajian.on('moveend',()=>{
      var center=(this.mapPengajian.getView().getCenter());
      this.longitude=center[0];
      this.latitude=center[1];
    });

    var that = this;
    this.mapPengajian.on('singleclick', async function(evt) {
      var dataPengajian;
      that.mapPengajian.forEachFeatureAtPixel(evt.pixel, function(feature, HeritageLayer) {
        if(feature.id_ != undefined) {
          dataPengajian = that.listPengajian.find(x => x.id === feature.id_);
        } else {
          dataPengajian = that.listPengajian.find(x => x.id === feature.values_.id);
        }
      });

      if(dataPengajian != undefined) {
        that.modalPeta(dataPengajian);
      }
    });

    //Instantiate with some options and add the Control
    var geocoder = new Geocoder('nominatim', {
      provider: 'osm',
      lang: 'id',
      placeholder: 'Cari Lokasi ...',
      limit: 5,
      debug: false,
      autoComplete: true,
      keepOpen: true
    });
    this.mapPengajian.addControl(geocoder);

    //Listen when an address is chosen
    geocoder.on('addresschosen', function (evt) {
      that.mapPengajian.getView().setCenter([evt.place.lon, evt.place.lat]);
      that.mapPengajian.getView().setZoom(11);
    });

    function coloredSvgMarker(lonLat, name, id, color) {
      if (!color) color = 'red';
      var feature = new Feature({
        geometry: new Point(lonLat),
        name: name,
        id: id
      });
    
      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1.0],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: './assets/icon/marker.svg',
            scale: 2,
            imgSize: [30, 30],
          })
        })
      );
      return feature;
    }

    setTimeout(() => {
      this.mapPengajian.setTarget(document.getElementById('mapPengajian'));
    }, 1000);
    this.loadingGetMap = false;
  }

}
