import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonDatetime, LoadingController, ModalController, Platform } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
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
useGeographic();

@Component({
  selector: 'app-tambah-pengajian',
  templateUrl: './tambah-pengajian.page.html',
  styleUrls: ['./tambah-pengajian.page.scss'],
})
export class TambahPengajianPage implements OnInit {
  
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef;
  map: Map;
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  dateValue = '';
  pengajianData:any = {};
  id:any;
  isCreated:boolean = true;
  loading:boolean;
  today:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    private geolocation: Geolocation,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private diagnostic: Diagnostic,
    private platform: Platform,
    private loadingController: LoadingController,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.today = new Date();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.checkPermission();
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailPengajian();
    }
  }

  getDetailPengajian() {
    this.api.get('pengajian/find/'+this.id).then(res => {
      this.pengajianData = res;
      this.dateValue = this.pengajianData.datetime;
    })
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
              header: 'LMSHD',
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
        }).catch(e => console.error(e));
    } else {
      this.generateMap(undefined);
    }
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
      this.setCoord(location);
      resolve(pos);
   }, (err: PositionError) => {
     reject(err.message);
    });
   });
  }

  locationNow:any;
  setCoord(data) {
    this.locationNow.lat = data.lat;
    this.locationNow.long = data.long;
    var dt = {
      lat: this.locationNow.lat, 
      long: this.locationNow.long
    }
    this.generateMap(dt);
    localStorage.setItem('latLong', JSON.stringify(dt));
    this.loadingController.dismiss();
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MMM dd yyyy HH:mm');
  }

  save() {
    if(new Date(this.dateValue) > this.today) {
      this.pengajianData.status = 'soon';
    } else {
      this.pengajianData.status = 'done';
    }
    this.pengajianData.datetime = new Date(this.dateValue);
    if(this.isCreated == true) {
      this.api.post('pengajian', this.pengajianData).then(res => {
        if(res) {
          alert('Berhasil menambahkan data.');
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    } else {
      this.api.put('pengajian/'+this.id, this.pengajianData).then(res => {
        if(res) {
          alert('Berhasil memperbarui data.');
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    }
  }

  done() {
    var conf = confirm('Jadwal pengajian sudah selesai?');
    if (conf) {
      this.pengajianData.status = 'done';
      this.api.put('pengajian/'+this.id, this.pengajianData).then(res => {
        if(res) {
          alert('Berhasil memperbarui data.');
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    }
  }

  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('pengajian/'+this.id).then(res => {
        if(res) {
          alert('Berhasil menghapus data.');
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    }
  }

  longitude:any;
  latitude:any;
  marker: Feature;
  vectorSource: VectorSource;
  vectorLayer: VectorLayer;
  height:any='300px';
  showToolbar:boolean=false;
  title:any = 'LMSHD';
  center:any=[110.3647,-7.8014];
  generateMap(data)
  {
    console.log(data)
    var features = [];
    if(data == undefined) {
      this.longitude = 110.3647;
      this.latitude = -7.8014;
      features.push(coloredSvgMarker([this.longitude,this.latitude], "LMSHD", "red"));
    } else {
      this.latitude = data.lat;
      this.longitude = data.long;
      features.push(coloredSvgMarker([this.longitude,this.latitude], "LMSHD", "red"));
    }

    this.vectorSource = new VectorSource({
      features: features 
    });
    
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    //get element ud
    var mapContainer = document.getElementsByClassName('ol-viewport');
    if(mapContainer != undefined && mapContainer[0] != undefined) mapContainer[0].remove();

    this.map = new Map({
      target: 'map',
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
    this.map.on('moveend',()=>{
      var center=(this.map.getView().getCenter());
      this.longitude=center[0];
      this.latitude=center[1];
    });

    var view = new View({
      center: [0, 0],
      zoom: 1,
    });

    var wmsSource = new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {'LAYERS': 'ne:ne', 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
    });

    this.map.on('singleclick', (evt) => {
      this.map.removeLayer(this.vectorLayer);
      document.getElementById('info').innerHTML = '';
      var viewResolution = /** @type {number} */ (view.getResolution());
      var url = wmsSource.getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        'EPSG:3857',
        {'INFO_FORMAT': 'text/html'}
      );
      if (url) {
        fetch(url)
          .then(function (response) { return response.text(); })
          .then(function (html) {
            document.getElementById('info').innerHTML = html;
          });
      }
      
      this.locationNow.lat = evt.coordinate_[0];
      this.locationNow.long = evt.coordinate_[1];
      var data = {
        latitude: this.locationNow.lat,
        longitude: this.locationNow.long
      }
      features = [];
      features.push(coloredSvgMarker([this.locationNow.long,this.locationNow.lat], "Lokasi Anda", "red"));
      this.vectorSource = new VectorSource({
        features: features 
      });
      
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource
      });

      this.map.addLayer(this.vectorLayer);
    });

    function coloredSvgMarker(lonLat,name, color) {
      if (!color) color = 'red';
      var feature = new Feature({
        geometry: new Point(lonLat),
        name: name
      });
      var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">' +
        '<path fill="' + color + '" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>' +
        '<circle fill="' + color + '" cx="15" cy="10.677" r="3.291"/></svg>';
    
      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1.0],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'data:image/svg+xml,' + escape(svg),
            scale: 2,
            imgSize: [30, 30],
          })
        })
      );
      return feature;
    }

    setTimeout(() => {
      this.map.setTarget(document.getElementById('map'));
    }, 1000);
  }

}
