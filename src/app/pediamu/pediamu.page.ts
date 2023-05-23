import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';


@Component({
  selector: 'app-pediamu',
  templateUrl: './pediamu.page.html',
  styleUrls: ['./pediamu.page.scss'],
})
export class PediamuPage implements OnInit {

  listPediamu:any = [];
  listPediamuTemp:any = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listPediamuInfinite = [];
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
    this.serverImg = this.common.photoBaseUrl+'pediamu/';
    this.listPediamu = [];
    this.listPediamuTemp = [];
    this.getAllPediamu();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listPediamu = [];
    this.listPediamuTemp = [];
    this.listPediamuInfinite = [];
    this.loadingService.present();
    this.getAllPediamu();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllPediamu() {
    this.api.get('pediamu?all=ok').then(async res => {
      this.listPediamu = res;
      this.listPediamuTemp = res;
      this.loadingService.dismiss();
      const nextData = this.listPediamu.slice(0, 9);
      this.listPediamuInfinite = await this.listPediamuInfinite.concat(nextData);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listPediamuInfinite.length > 0) {
        startIndex = this.listPediamuInfinite.length;
      }
      const nextData = this.listPediamu.slice(startIndex, this.listPediamuInfinite.length + 9);
      this.listPediamuInfinite = this.listPediamuInfinite.concat(nextData);
      event.target.complete();

      if (this.listPediamuInfinite.length >= this.listPediamu.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  initializeItems(): void {
    this.listPediamu = this.listPediamuTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      const nextData = this.listPediamu.slice(0, 9);
      this.listPediamuInfinite = await this.listPediamuInfinite.concat(nextData);
      return;
    }

    this.listPediamuInfinite = this.listPediamu.filter(articles => {
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
