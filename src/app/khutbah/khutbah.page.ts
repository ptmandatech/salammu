import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-khutbah',
  templateUrl: './khutbah.page.html',
  styleUrls: ['./khutbah.page.scss'],
})
export class KhutbahPage implements OnInit {

  listKhutbah:any = [];
  listKhutbahTemp:any = [];
  serverImg: any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.present();
    this.serverImg = this.common.photoBaseUrl+'khutbah/';
    this.listKhutbah = [];
    this.listKhutbahTemp = [];
    this.getAllKhutbah();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listKhutbah = [];
    this.listKhutbahTemp = [];
    this.present();
    this.getAllKhutbah();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async present() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      duration: 2000,
      message: 'Tunggu Sebentar...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
      });
      this.loading = false;
    });
  }

  getAllKhutbah() {
    this.api.get('khutbah?all=ok').then(res => {
      this.listKhutbah = res;
      this.listKhutbahTemp = res;
      this.loading = false;
      this.loadingController.dismiss();
    }, error => {
      this.loading = false;
      this.loadingController.dismiss();
    })
  }

  initializeItems(): void {
    this.listKhutbah = this.listKhutbahTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listKhutbah = this.listKhutbah.filter(khutbah => {
      if (khutbah.title && searchTerm) {
        if (khutbah.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        if (khutbah.science_name && searchTerm) {
          if (khutbah.science_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
        return false;
      }
    });
  }

  detail(data) {
    const param: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(data)
      }
    }
    this.router.navigate(['khutbah/detail-khutbah'], param);
  }

}
