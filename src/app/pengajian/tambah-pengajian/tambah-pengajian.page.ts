import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonDatetime, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;
  constructor(
    public http:HttpClient,
    public api: ApiService,
    public common: CommonService,
    private geolocation: Geolocation,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private diagnostic: Diagnostic,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private loadingController: LoadingController,
    public alertController: AlertController,
    private toastController: ToastController,
    private datePipe: DatePipe,
  ) {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      speaker: [null, [Validators.required]],
      descriptions: [null, [Validators.required]],
      organizer: [null, [Validators.required]],
      branch: [null],
      twig: [null],
      organizer_name: [null],
      url_livestream: [null],
      location: [null, [Validators.required]],
      verified: [null],
      created_by: [null],
    });
  }

  branchSelected:any;
  twigSelected:any;
  pilihCabang(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.branchSelected = event.value;
  }

  pilihRanting(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.twigSelected = event.value;
  }

  async ngOnInit() {
    this.cekLogin();
    await this.getAllCr();
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

  listCabang:any = [];
  listRanting:any = [];
  async getAllCr() {
    // this.api.get('cr').then(res => {
    //   this.parseData(res);
    // }, error => {
    //   this.loading = false;
    // })
    try {
      await this.api.get('sicara/getAllPCM').then(res=>{ 
        this.listCabang = res;
        this.loading = false;
      }, err => {
        this.loading = false;
      });
    } catch {

    }
    try {
      await this.api.get('sicara/getAllPRM').then(res=>{
        this.listRanting = res;
        this.loading = false;
      }, err => {
        this.loading = false;
      });
    } catch {

    }
  }

  // parseData(res) {
  //   for(var i=0; i<res.length; i++) {
  //     if(res[i].category == 'cabang') {
  //       let idx = this.listCabang.indexOf(res[i]);
  //       if(idx == -1) {
  //         this.listCabang.push(res[i]);
  //       }
  //     } else if(res[i].category == 'ranting') {
  //       let idx = this.listRanting.indexOf(res[i]);
  //       if(idx == -1) {
  //         this.listRanting.push(res[i]);
  //       }
  //     }
  //   }
  //   this.loading = false;
  // }

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
      if(this.pengajianData.branch != null) {
        this.branchSelected = this.listCabang.find(x => x.id === this.pengajianData.branch);
      }
      if(this.pengajianData.twig != null) {
        this.twigSelected = this.listRanting.find(x => x.id === this.pengajianData.twig);
      }
      this.dateValue = this.datePipe.transform(new Date(this.pengajianData.datetime), 'MMM dd yyyy HH:mm');
      if(this.pengajianData != null) {
        this.form.patchValue({
          id: this.pengajianData.id,
          name: this.pengajianData.name,
          speaker: this.pengajianData.speaker,
          descriptions: this.pengajianData.descriptions,
          organizer: this.pengajianData.organizer,
          branch: this.pengajianData.branch,
          twig: this.pengajianData.twig,
          organizer_name: this.pengajianData.organizer_name,
          url_livestream: this.pengajianData.url_livestream,
          location: this.pengajianData.location,
          verified: this.pengajianData.verified,
          created_by: this.pengajianData.created_by,
        });
      }
    })
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MMM dd yyyy HH:mm');
  }

  save() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      if(this.form.get('url_livestream').value) {
        if(this.isValidUrl(this.form.get('url_livestream').value)) { 
        } else {
          this.toastController
          .create({
            message: 'Masukkan url dengan format yang benar, contoh https://example.com',
            duration: 2000,
            color: "danger",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          return;
        }
      }
      
      if(!this.dateValue) {
        this.toastController
          .create({
            message: 'Pilih Tanggal dan Jam Pengajian!',
            duration: 2000,
            color: "danger",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          return;
      }

      this.pengajianData.name = this.form.get('name').value;
      this.pengajianData.speaker = this.form.get('speaker').value;
      this.pengajianData.descriptions = this.form.get('descriptions').value;
      this.pengajianData.organizer = this.form.get('organizer').value;
      this.pengajianData.url_livestream = this.form.get('url_livestream').value;
      this.pengajianData.location = this.form.get('location').value;

      if(this.branchSelected != undefined) this.pengajianData.branch = this.branchSelected.id;
      if(this.twigSelected != undefined) this.pengajianData.twig = this.twigSelected.id;
  
      if(new Date(this.dateValue) > this.today) {
        this.pengajianData.status = 'soon';
      } else {
        this.pengajianData.status = 'done';
      }
      this.pengajianData.datetime = new Date(this.dateValue);
      if(this.isCreated == true) {
        this.pengajianData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
        this.pengajianData.verified = false;
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
  }

  urlRegEx = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";
  isValidUrl(urlString: string): boolean {
    try {
      let pattern = new RegExp(this.urlRegEx);
      let valid = pattern.test(urlString);
      return valid;
    } catch (TypeError) {
      return false;
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
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
      if(this.detailLocSelected == undefined || this.detailLocSelected.address.state_district == undefined) {
        await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
          this.detailLocSelected = res;
          this.city = this.detailLocSelected.features[0].properties.address.state;
        })
      } else {
        this.city = this.detailLocSelected.address.state_district.replace('Kota ', '');
      }
    }, async error => {
      await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
        this.detailLocSelected = res;
        this.city = this.detailLocSelected.city.replace('Kota ', '');
      })
    });
  }

}
