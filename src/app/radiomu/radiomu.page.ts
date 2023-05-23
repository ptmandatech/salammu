import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';


@Component({
  selector: 'app-radiomu',
  templateUrl: './radiomu.page.html',
  styleUrls: ['./radiomu.page.scss'],
})
export class RadiomuPage implements OnInit {

  listRadiomu:any = [];
  listRadiomuTemp:any = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listRadiomuInfinite = [];
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
    this.serverImg = this.common.photoBaseUrl+'radiomu/';
    this.listRadiomu = [];
    this.listRadiomuTemp = [];
    this.getAllRadiomu();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listRadiomu = [];
    this.listRadiomuTemp = [];
    this.listRadiomuInfinite = [];
    this.loadingService.present();
    this.getAllRadiomu();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllRadiomu() {
    this.api.get('radiomu').then(async res => {
      this.listRadiomu = res;
      this.listRadiomuTemp = res;
      this.loading = false;
      const nextData = this.listRadiomu.slice(0, 9);
      this.listRadiomuInfinite = await this.listRadiomuInfinite.concat(nextData);
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listRadiomuInfinite.length > 0) {
        startIndex = this.listRadiomuInfinite.length;
      }
      const nextData = this.listRadiomu.slice(startIndex, this.listRadiomuInfinite.length + 9);
      this.listRadiomuInfinite = this.listRadiomuInfinite.concat(nextData);
      event.target.complete();

      if (this.listRadiomuInfinite.length >= this.listRadiomu.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  initializeItems(): void {
    this.listRadiomu = this.listRadiomuTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      const nextData = this.listRadiomu.slice(0, 9);
      this.listRadiomuInfinite = await this.listRadiomuInfinite.concat(nextData);
      return;
    }

    this.listRadiomuInfinite = this.listRadiomu.filter(articles => {
      if (articles.title && searchTerm) {
        if (articles.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        if (articles.user_name && searchTerm) {
          if (articles.user_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          if (articles.summary && searchTerm) {
            if (articles.summary.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
          return false;
        }
        return false;
      }
    });
  }

}
