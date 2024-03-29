import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ModalPetaComponent } from 'src/app/pengajian/modal-peta/modal-peta.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { LoadingService } from 'src/app/services/loading.service';
useGeographic();

@Component({
  selector: 'app-ranting',
  templateUrl: './ranting.page.html',
  styleUrls: ['./ranting.page.scss'],
})
export class RantingPage implements OnInit {

  
  id:any;
  isCreated:boolean = true;
  loading:boolean;
  dataRanting:any = {};
  userData:any;
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef;
  mapDetail: Map;
  constructor(
    public http:HttpClient, 
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public alertController: AlertController,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.loading = true;
    this.id = this.routes.snapshot.paramMap.get('id');
    this.cekLogin();
    this.getDetailRanting();
  }

  cekLogin()
  {
    this.api.me().then(res=>{
      this.userData = res;
      this.loadingService.dismiss();
    }, error => {
      this.loadingService.dismiss();
      console.log(error);
    })
  }

  getDetailRanting() {
    this.api.get('sicara/find/sicara_prm/'+this.id).then(res=>{
      this.dataRanting = res;
      if(this.dataRanting.pin != null) {
        var dt = JSON.parse(this.dataRanting.pin);
        this.getDetailLocation(dt);
        this.generateMap(dt);
      }
      this.loadingService.dismiss();
    }, error => {
      this.loadingService.dismiss();
      console.log(error);
    })
  }

  httpOption:any;
  locationNow:any;
  city:any;
  async getDetailLocation(dt) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    await this.api.post('lokasi/openstreetmap', dt).then(async res => {
      this.checkCity(res);
    }, async error => {
      await this.api.post('lokasi/mapquestapi', dt).then(async res => {
        this.locationNow = res;
        this.city = this.locationNow.city.replace('Kota ', '');
      })
    });
  }
  
  checkCity(res) {
    this.locationNow = res.features[0].properties;
    
    this.city = this.locationNow['address'] ? this.locationNow['address']['city_district'] ? this.locationNow['address']['city_district']:this.locationNow['address']['county']:this.locationNow['name'];
    if(!this.city) {
      this.city = res.features[0].properties.address.city == null ? res.features[0].properties.address.county:res.features[0].properties.address.city;
    }
  }

  longitude:any;
  latitude:any;
  marker: Feature;
  vectorSource: VectorSource;
  vectorLayer: VectorLayer;
  height:any='300px';
  showToolbar:boolean=false;
  center:any=[110.3647,-7.8014];
  generateMap(data)
  {
    var features = [];
    this.latitude = data.lat;
    this.longitude = data.long;
    features.push(coloredSvgMarker([this.longitude,this.latitude], this.dataRanting.nama, "red"));

    this.vectorSource = new VectorSource({
      features: features 
    });
    
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    var overlay = new Overlay({
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    this.mapDetail = new Map({
      overlays: [overlay],
      target: 'mapDetail',
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
    this.mapDetail.on('moveend',()=>{
      var center=(this.mapDetail.getView().getCenter());
      this.longitude=center[0];
      this.latitude=center[1];
    });

    var that = this;
    this.mapDetail.on('singleclick', async function(evt) {
      const alert = await that.alertController.create({
        cssClass: 'my-custom-class',
        header: that.dataRanting.nama,
        message: that.dataRanting.deskripsi,
        buttons: [
          {
            text: 'Tutup',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Pergi Ke Lokasi',
            handler: () => {
              that.openMap();
            }
          }
        ]
      });
      await alert.present();
    });

    function coloredSvgMarker(lonLat,name, color) {
      if (!color) color = 'red';
      var feature = new Feature({
        geometry: new Point(lonLat),
        name: name
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
      this.mapDetail.setTarget(document.getElementById('mapDetail'));
    }, 1000);
  }

  openMap() {
    if(this.dataRanting.pin != null) {
      var dt = JSON.parse(this.dataRanting.pin);
      window.open('http://www.google.com/maps/place/'+dt.lat+','+dt.long);
    } else {
      alert('Pin lokasi belum diatur!');
    }
  }

}
