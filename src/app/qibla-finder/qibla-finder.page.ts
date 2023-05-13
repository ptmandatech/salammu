import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@awesome-cordova-plugins/device-orientation/ngx';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-qibla-finder',
  templateUrl: './qibla-finder.page.html',
  styleUrls: ['./qibla-finder.page.scss'],
})
export class QiblaFinderPage implements OnInit {

  loading:boolean;
  city:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private geolocation: Geolocation,
    private loadingService: LoadingService,
    private deviceOrientation: DeviceOrientation,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingService.present();
    this.city = localStorage.getItem('selectedCity');
    this.initOrientation();
  }

  async doRefresh(event) {
    this.loading = true;
    this.loadingService.present();
    this.city = localStorage.getItem('selectedCity');
    this.initOrientation();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  // Initial Kaaba location that we've got from google maps
  private kaabaLocation: {lat:number,lng:number} = {lat: 21.42276, lng: 39.8256687};
  // Initial Qibla Location
  public qiblaLocation = 0;
  data: DeviceOrientationCompassHeading;
  public currentLocation: Geoposition;
  initOrientation() {
    // Watch the device compass heading change
    this.deviceOrientation.watchHeading().subscribe((res: DeviceOrientationCompassHeading) => {
      this.data = res;
      // Change qiblaLocation when currentLocation is not empty 
      if (!!this.currentLocation) {
        const currentQibla = res.magneticHeading-this.getQiblaPosition();
        this.qiblaLocation = currentQibla > 360 ? currentQibla%360 : currentQibla;
      }
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    });

    // Watch current location
    this.geolocation.watchPosition().subscribe(async (pos: Geoposition) => {
      this.currentLocation = pos;
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    });
  }

  getQiblaPosition() {
    // Convert all geopoint degree to radian before jump to furmula
    const currentLocationLat = this.degreeToRadian(this.currentLocation.coords.latitude);
    const currentLocationLng = this.degreeToRadian(this.currentLocation.coords.longitude);
    const kaabaLocationLat = this.degreeToRadian(this.kaabaLocation.lat);
    const kaabaLocationLng = this.degreeToRadian(this.kaabaLocation.lng);

    // Use Basic Spherical Trigonometric Formula
    return this.radianToDegree(
      Math.atan2(
        Math.sin(kaabaLocationLng-currentLocationLng),
        (Math.cos(currentLocationLat) * Math.tan(kaabaLocationLat) - Math.sin(currentLocationLat) * Math.cos(kaabaLocationLng - currentLocationLng))
      )
    );
  }

  /**
   * Convert from Radian to Degree
   * @param radian 
   */
  radianToDegree(radian: number) {
    return radian * 180 / Math.PI;
  }

  /**
   * Convert from Degree to Radian
   * @param degree 
   */
  degreeToRadian(degree: number) {
    return degree * Math.PI / 180;
  }
}
