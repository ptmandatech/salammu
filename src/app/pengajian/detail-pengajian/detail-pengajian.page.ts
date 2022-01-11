import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
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
useGeographic();

@Component({
  selector: 'app-detail-pengajian',
  templateUrl: './detail-pengajian.page.html',
  styleUrls: ['./detail-pengajian.page.scss'],
})
export class DetailPengajianPage implements OnInit {

  pengajianData:any;
  id:any;
  loading:boolean;
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef;
  mapDetail: Map;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public alertController: AlertController,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.id = this.routes.snapshot.paramMap.get('id');
    this.getDetailPengajian();
  }

  getDetailPengajian() {
    this.api.get('pengajian/find/'+this.id).then(res => {
      this.pengajianData = res;
      if(this.pengajianData.pin != null) {
        var dt = JSON.parse(this.pengajianData.pin);
        this.generateMap(dt);
      }
    })
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
    features.push(coloredSvgMarker([this.longitude,this.latitude], this.pengajianData.name, "red"));

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
        header: that.pengajianData.name,
        message: that.pengajianData.descriptions,
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
      this.mapDetail.setTarget(document.getElementById('mapDetail'));
    }, 1000);
  }

  openMap() {
    if(this.pengajianData.pin != null) {
      var dt = JSON.parse(this.pengajianData.pin);
      window.open('http://www.google.com/maps/place/'+dt.lat+','+dt.long);
    } else {
      alert('Pin lokasi belum diatur!');
    }
  }

}
