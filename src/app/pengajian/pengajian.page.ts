import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonInfiniteScroll, LoadingController, ModalController, Platform } from '@ionic/angular';
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
import { LoadingService } from '../services/loading.service';
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
    private loadingService: LoadingService,
    public alertController: AlertController,
    private diagnostic: Diagnostic,
    private loadingController: LoadingController,
    private platform: Platform,
  ) { }

  async ngOnInit() {
    this.loadingGetMap = true;
    this.loadingService.present();
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

  async doRefresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
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
      this.loadingService.dismiss();
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
      let city = localStorage.getItem('selectedCity');
      if(city) {
        this.city = city;
        this.getCal();
      }
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

    await this.api.post('lokasi/openstreetmap', dt).then(async res => {
      this.checkCity(res);
      if(!res) {
        await this.api.post('lokasi/mapquestapi', dt).then(async res => {
          this.locationNow = res;
          if(this.locationNow.address.state_district != undefined) {
            this.city = this.locationNow.address.state_district.replace('Kota ', '');
            this.getCal();
          }
        }, err => {
          this.getCityFromLocal();
        })
      }
      this.loadingService.dismiss();
    }, async error => {
      await this.api.post('lokasi/openstreetmap', dt).then(res => {
        this.checkCity(res);
      }, err => {
        this.getCityFromLocal();
      })
      this.loadingService.dismiss();
    });

    let city = localStorage.getItem('selectedCity');
    if(city) {
      this.city = city;
      this.getCal();
    }
  }

  getCityFromLocal() {
    let city = localStorage.getItem('selectedCity');
    if(city) {
      this.city = city;
      this.getCal();
    }
  }

  checkCity(res) {
    this.locationNow = res.features[0].properties;
    
    this.city = this.locationNow['address'] ? this.locationNow['address']['city_district'] ? this.locationNow['address']['city_district']:this.locationNow['address']['county']:this.locationNow['name'];
    if(!this.city) {
      this.city = res.features[0].properties.address.city == null ? res.features[0].properties.address.county:res.features[0].properties.address.city;
    }
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
        // if(this.cal[this.week[i]][j] != 0) {
        //   let tahun = this.cal[this.week[i]][j].tahun;
        //   let bulan = this.cal[this.week[i]][j].bulan;
        //   let tanggal = this.cal[this.week[i]][j].tanggal;
        //   let datetime = this.datePipe.transform(new Date(tahun, bulan-1, tanggal), 'yyyy-MM-dd');
        //   await this.parseDataPengajian(datetime, tanggal, bulan, tahun);
        // }

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
    this.dataPengajian = {};
    this.pengajian = [];
    this.api.get('pengajian?all=ok').then(async res => {
      this.pengajian = res;
      await this.parsePengajianAwal();
    }, error => {
      this.loadingService.dismiss();
      this.loading = false;
    })
  }

  parsePengajianAwal() {
    for(var i=0; i<this.pengajian.length; i++) {
      if(this.pengajian[i].datetime != '') {
        let tahun = this.datePipe.transform(new Date(this.pengajian[i].datetime), 'yyyy');
        let bulan = this.datePipe.transform(new Date(this.pengajian[i].datetime), 'MM');
        let tanggal = this.datePipe.transform(new Date(this.pengajian[i].datetime), 'dd');
  
        if(this.dataPengajian[Number(tanggal)+'_'+Number(bulan)+'_'+tahun] == undefined) {
          this.dataPengajian[Number(tanggal)+'_'+Number(bulan)+'_'+tahun] = [];
        }
  
        let idx = this.dataPengajian[Number(tanggal)+'_'+Number(bulan)+'_'+tahun].indexOf(this.pengajian[i]);
        if(idx == -1) {
          this.dataPengajian[Number(tanggal)+'_'+Number(bulan)+'_'+tahun].push(this.pengajian[i]);
        }
      }
    }
    this.loadingService.dismiss();
  }

  checkAgenda(data) {
    const hasSoonEvent = data.some(event => event.status === "soon");

    if (hasSoonEvent) {
      return "soon";
    } else {
      return "done";
    }
  }

  // parseDataPengajian(datetime, tanggal, bulan, tahun) {
  //   for(var i=0; i<this.pengajian.length; i++) {
  //     let dt = this.datePipe.transform(new Date(this.pengajian[i].datetime), 'yyyy-MM-dd');
  //     if(dt == datetime) {
  //       if(this.dataPengajian[tanggal+'_'+bulan+'_'+tahun] == undefined) {
  //         this.dataPengajian[tanggal+'_'+bulan+'_'+tahun] = [];
  //       }
  //       let idx = this.dataPengajian[tanggal+'_'+bulan+'_'+tahun].indexOf(this.pengajian[i]);
  //       if(idx == -1) {
  //         this.dataPengajian[tanggal+'_'+bulan+'_'+tahun].push(this.pengajian[i]);
  //       }
  //     }
  //   }
  // }

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
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 1],
    });
    return await modal.present();
  }

  listPengajian:any = [];
  listPengajianTemp:any = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listPengajianInfinite = [];
  loading:boolean;
  getAllPengajian() {
    this.listPengajian = [];
    this.listPengajianTemp = [];
    this.listPengajianInfinite = [];
    this.api.get('pengajian?all=ok').then(async res => {
      this.listPengajian = res;
      this.listPengajianTemp = res;
      const nextData = this.listPengajian.slice(0, 9);
      this.listPengajianInfinite = await this.listPengajianInfinite.concat(nextData);
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
      if(this.listPengajian[i].pin != null && this.listPengajian[i].status != 'done') {
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

    var wmsSource = new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {'LAYERS': 'ne:ne', 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
    });
    
    var view = new View({
      center: [0, 0],
      zoom: 1,
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
      that.mapPengajian.getView().setZoom(18);
      
      that.mapPengajian.removeLayer(that.vectorLayer);
      // document.getElementById('info').innerHTML = '';
      var viewResolution = /** @type {number} */ (view.getResolution());
      var url = wmsSource.getFeatureInfoUrl(
        evt.place,
        viewResolution,
        'EPSG:3857',
        {'INFO_FORMAT': 'text/html'}
      );
      // if (url) {
      //   fetch(url)
      //     .then(function (response) {
      //       return response.text();
      //     })
      //     .then(function (html) {
      //       document.getElementById('info').innerHTML = html;
      //     });
      // }

      features = [];
      features.push(coloredSvgMarker([evt.place.lon, evt.place.lat], "Lokasi Terpilih", '0', "red"));

      that.vectorSource = new VectorSource({
        features: features
      });

      that.vectorLayer = new VectorLayer({
        source: that.vectorSource
      });

      that.mapPengajian.addLayer(that.vectorLayer);
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
    this.loadingService.dismiss();
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listPengajianInfinite.length > 0) {
        startIndex = this.listPengajianInfinite.length;
      }
      const nextData = this.listPengajian.slice(startIndex, this.listPengajianInfinite.length + 9);
      this.listPengajianInfinite = this.listPengajianInfinite.concat(nextData);
      event.target.complete();

      if (this.listPengajianInfinite.length >= this.listPengajian.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

}
