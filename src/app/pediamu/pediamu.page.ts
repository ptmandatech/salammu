import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
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
    this.loadingService.present();
    this.getAllPediamu();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllPediamu() {
    this.api.get('pediamu?all=ok').then(res => {
      this.listPediamu = res;
      this.listPediamuTemp = res;
      this.loadingService.dismiss();
      this.loading = false;
    }, error => {
      this.loading = false;
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  initializeItems(): void {
    this.listPediamu = this.listPediamuTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listPediamu = this.listPediamu.filter(articles => {
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
