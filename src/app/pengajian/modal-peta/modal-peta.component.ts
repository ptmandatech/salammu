import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-modal-peta',
  templateUrl: './modal-peta.component.html',
  styleUrls: ['./modal-peta.component.scss'],
})
export class ModalPetaComponent implements OnInit {

  dataPengajian:any;
  constructor(
    public http:HttpClient, 
    public router: Router,
    public navParams: NavParams,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.dataPengajian = this.navParams.get('data');
    if(this.dataPengajian.pin != null) {
      let pin = JSON.parse(this.dataPengajian.pin);
      this.getDetailLocation(pin);
    }
  }

  detailPengajian() {
    this.router.navigate(['/pengajian/detail-pengajian',this.dataPengajian.id]);
    this.dismiss();
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

    await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat +'&lon=' + dt.long, this.httpOption).subscribe(async res => {
      this.checkCity(res);
    }, async error => {
      await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
        this.checkCity(res);
      })
    });

    let city = localStorage.getItem('selectedCity');
    if(city) {
      this.city = city;
    }
  }

  checkCity(res) {
    this.locationNow = res.features[0].properties;
    this.city = res.features[0].properties.address.city == null ? res.features[0].properties.address.town:res.features[0].properties.address.city;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
