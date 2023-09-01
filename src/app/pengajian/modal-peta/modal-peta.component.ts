import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

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
    public api: ApiService,
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
    await this.api.post('lokasi/openstreetmap', dt).then(async res => {
      this.checkCity(res);
    }, async error => {
      await this.api.post('lokasi/mapquestapi', dt).then(res => {
        // this.checkCity(res);
        this.locationNow = res;
        this.city = this.locationNow.address.state_district.replace('Kota ', '');
      })
    });

    let city = localStorage.getItem('selectedCity');
    if(city) {
      this.city = city;
    }
  }

  checkCity(res) {
    this.locationNow = res.features[0].properties;
    
    this.city = this.locationNow['address'] ? this.locationNow['address']['city_district'] ? this.locationNow['address']['city_district']:this.locationNow['address']['county']:this.locationNow['name'];
    if(!this.city) {
      this.city = res.features[0].properties.address.city == null ? res.features[0].properties.address.county:res.features[0].properties.address.city;
    }
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
