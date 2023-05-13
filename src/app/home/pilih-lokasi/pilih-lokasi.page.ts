import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-pilih-lokasi',
  templateUrl: './pilih-lokasi.page.html',
  styleUrls: ['./pilih-lokasi.page.scss'],
})
export class PilihLokasiPage implements OnInit {

  loading:boolean;
  constructor(
    public modalController: ModalController,
    private loadingService: LoadingService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingService.present();
    this.getAllCity();
  }

  allCity:any = [];
  allCityTemp:any = [];
  getAllCity() {
    this.api.get('sicara/getAllCity/').then(res => {
      this.allCity = res;
      this.allCityTemp = res;
      this.loading = false;
      this.loadingService.dismiss();
    }, error => {
      this.loadingService.dismiss();
      this.loading = false;
    })
  }

  initializeItems(): void {
    this.allCity = this.allCityTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.allCity = this.allCity.filter(city => {
      if (city.kab_nama && searchTerm) {
        if (city.kab_nama.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  dismiss(data) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss(data);
  }


}
