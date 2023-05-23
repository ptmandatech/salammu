import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-khutbah',
  templateUrl: './khutbah.page.html',
  styleUrls: ['./khutbah.page.scss'],
})
export class KhutbahPage implements OnInit {

  listKhutbah:any = [];
  listKhutbahTemp:any = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listKhutbahInfinite = [];
  serverImg: any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingService.present();
    this.serverImg = this.common.photoBaseUrl+'khutbah/';
    this.listKhutbah = [];
    this.listKhutbahTemp = [];
    this.getAllKhutbah();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listKhutbah = [];
    this.listKhutbahTemp = [];
    this.listKhutbahInfinite = [];
    this.loadingService.present();
    this.getAllKhutbah();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllKhutbah() {
    this.api.get('khutbah?all=ok').then(async res => {
      this.listKhutbah = res;
      this.listKhutbahTemp = res;
      const nextData = this.listKhutbah.slice(0, 9);
      this.listKhutbahInfinite = await this.listKhutbahInfinite.concat(nextData);
      this.loading = false;
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listKhutbahInfinite.length > 0) {
        startIndex = this.listKhutbahInfinite.length;
      }
      const nextData = this.listKhutbah.slice(startIndex, this.listKhutbahInfinite.length + 9);
      this.listKhutbahInfinite = this.listKhutbahInfinite.concat(nextData);
      event.target.complete();

      if (this.listKhutbahInfinite.length >= this.listKhutbah.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  initializeItems(): void {
    this.listKhutbah = this.listKhutbahTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      const nextData = this.listKhutbah.slice(0, 9);
      this.listKhutbahInfinite = await this.listKhutbahInfinite.concat(nextData);
      return;
    }

    this.listKhutbahInfinite = this.listKhutbah.filter(khutbah => {
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
