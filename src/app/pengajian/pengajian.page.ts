import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CalendarService } from '../services/calendar.service';
import { ModalKalenderComponent } from './modal-kalender/modal-kalender.component';
import { ModalPetaComponent } from './modal-peta/modal-peta.component';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';

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
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
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

  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    private datePipe: DatePipe,
    private geolocation: Geolocation,
    private calendar:CalendarService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    this.loadingGetMap = true;
    this.cekLogin();
    this.getAllPengajian();
    let date = new Date();
    this.dateToday = Number(this.datePipe.transform(new Date(date), 'dd'));
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

  getCurrentLocations() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
    }).catch((error) => {
      if(this.latitude == undefined && this.longitude == undefined) {
        this.latitude = this.center[1];
        this.longitude = this.center[0];
      }
      console.log('Error getting location', error);
    });
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
  next(from)
  {
      var cal=this.calendar.next(this.selected, from).data;
      this.selected=this.calendar.next(this.selected, from).selected;
      this.parseCal(cal);
  }
  prev(from)
  {
      var cal=this.calendar.previous(this.selected, from).data;
      this.selected=this.calendar.previous(this.selected, from).selected;
      this.parseCal(cal);
  }

  //pilih cell
  cellSelected:any={};
  selectCell(m,n)
  {
     this.cellSelected={};
     this.cellSelected[m+n]=true;
     var date=this.cal[m][n];
     this.selected=new Date(date.tahun,date.bulan-1,date.tanggal);
     this.modalKelander(this.selected);
  }

  //Modal Kalender
  async modalKelander(selected) {
    const modal = await this.modalController.create({
      component: ModalKalenderComponent,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      componentProps: {data:selected}
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
    this.api.get('pengajian').then(res => {
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
