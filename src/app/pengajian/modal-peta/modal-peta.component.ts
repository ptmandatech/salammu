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
    console.log(this.dataPengajian)
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

    await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat +'&lon=' + dt.long, this.httpOption).subscribe(async res => {
      this.locationNow = res;
      this.city = this.locationNow.address.state_district.replace('Kota ', '');
      if(this.locationNow == undefined) {
        await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
          this.locationNow = res;
          this.city = this.locationNow.city.replace('Kota ', '');
        })
      }
    }, async error => {
      await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
        this.locationNow = res;
        this.city = this.locationNow.city.replace('Kota ', '');
      })
    });
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
