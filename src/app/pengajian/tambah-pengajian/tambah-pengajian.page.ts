import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonDatetime, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
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
import Geocoder from 'ol-geocoder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
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
  userData:any;
  today:any;
  constructor(
    public http:HttpClient, 
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
    private toastController: ToastController,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.cekLogin();
    this.today = new Date();
    this.id = this.routes.snapshot.paramMap.get('id');
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailPengajian();
    } else {
      this.generateMap(undefined);
    }
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      await this.loadingController.dismiss();
    }, async error => {
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.userData = undefined;
      await this.loadingController.dismiss();
    })
  }

  locationNow:any;
  async getDetailPengajian() {
    await this.api.get('pengajian/find/'+this.id).then(res => {
      this.pengajianData = res;
      if(this.pengajianData.pin != null) {
        var dt = JSON.parse(this.pengajianData.pin);
        this.generateMap(dt);
        this.getDetailLocation(dt);
      } else {
        this.generateMap(undefined);
      }
      this.dateValue = this.datePipe.transform(new Date(this.pengajianData.datetime), 'MMM dd yyyy HH:mm');
    })
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
    this.pengajianData.verified = false;
    this.pengajianData.datetime = new Date(this.dateValue);
    if(this.isCreated == true) {
      this.api.post('pengajian', this.pengajianData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menambahkan data.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    } else {
      this.api.put('pengajian/'+this.id, this.pengajianData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil memperbarui data.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
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
          this.toastController
          .create({
            message: 'Berhasil memperbarui data.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
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
          this.toastController
          .create({
            message: 'Berhasil menghapus data.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    }
  }

  verifikasi() {
    this.loading = true;
    var conf = confirm('Anda yakin ingin melanjutkan verifikasi data pengajian?');
    if (conf) {
      this.pengajianData.verified = true;
      this.api.put('pengajian/'+ this.id, this.pengajianData).then(res => {
        if(res) {
          this.loading = false;
          this.toastController
          .create({
            message: 'Berhasil memverifikasi data pengajian.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      }).catch(error => {
        this.loading = false;
      })
    } else {
      this.loading = false;
    }
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
  generateMap(data)
  {
    if(this.pengajianData.pin != null) {
      data = JSON.parse(this.pengajianData.pin);
    }
    var features = [];
    if(data == undefined) {
      this.longitude = 110.3647;
      this.latitude = -7.8014;
      this.locationNow = {};
      this.locationNow.lat = this.latitude;
      this.locationNow.long = this.longitude;
      features.push(coloredSvgMarker([0,0], "SalamMU", "red"));
    } else {
      this.latitude = data.lat;
      this.longitude = data.long;
      features.push(coloredSvgMarker([this.longitude,this.latitude], "SalamMU", "red"));
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
      this.longitude = evt.coordinate[0];
      this.latitude = evt.coordinate[1];
      if(this.locationNow == undefined) {
        this.locationNow = {};
      }
      this.locationNow.lat = this.latitude;
      this.locationNow.long = this.longitude;
      var dt = {
        lat: this.locationNow.lat, 
        long: this.locationNow.long
      }
      this.getDetailLocation(dt);
      this.pengajianData.pin = JSON.stringify(dt);
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
          .then(function (response) { 
            return response.text(); 
          })
          .then(function (html) {
            document.getElementById('info').innerHTML = html;
          });
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

    var that = this;
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
    this.map.addControl(geocoder);

    //Listen when an address is chosen
    geocoder.on('addresschosen', function (evt) {
      that.map.getView().setCenter([evt.place.lon, evt.place.lat]);
      that.map.getView().setZoom(11);
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
      this.map.setTarget(document.getElementById('map'));
    }, 1000);
  }

  httpOption:any;
  detailLocSelected:any;
  city:any;
  async getDetailLocation(dt) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat +'&lon=' + dt.long, this.httpOption).subscribe(async res => {
      this.detailLocSelected = res;
      this.city = this.detailLocSelected.address.state_district.replace('Kota ', '');
      if(this.detailLocSelected == undefined) {
        await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
          this.detailLocSelected = res;
          this.city = this.detailLocSelected.city.replace('Kota ', '');
        })
      }
    }, async error => {
      await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
        this.detailLocSelected = res;
        this.city = this.detailLocSelected.city.replace('Kota ', '');
      })
    });
  }

}
