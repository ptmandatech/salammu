import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-sicara',
  templateUrl: './sicara.page.html',
  styleUrls: ['./sicara.page.scss'],
})
export class SicaraPage implements OnInit {

  listWilayah:any = [];
  listWilayahTemp:any = [];
  listDaerah:any = [];
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    private loadingService: LoadingService,
    public router:Router,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.loading = true;
    this.getAllWilayah();
  }

  getAllWilayah() {
    this.api.get('sicara/getAllPWM').then(res => {
      this.listWilayah = res;
      this.listWilayahTemp = res;
      this.loading = false;
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  initializeItems(): void {
    this.listWilayah = this.listWilayahTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listWilayah = this.listWilayah.filter(data => {
      if (data.nama && searchTerm) {
        if (data.nama.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  getChildDaerah(n) {
    this.loadingService.present();
    this.api.get('sicara/getPDM/'+n.id).then(res => {
      this.listDaerah = res;
      this.loading = false;
      this.loadingService.dismiss();
    }, error => {
      this.loadingService.dismiss();
      this.loading = false;
    })
  }

}
