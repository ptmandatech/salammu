import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';


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
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'pediamu/';
    this.listPediamu = [];
    this.listPediamuTemp = [];
    this.getAllPediamu();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listPediamu = [];
    this.listPediamuTemp = [];
    this.getAllPediamu();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllPediamu() {
    this.api.get('pediamu').then(res => {
      this.listPediamu = res;
      this.listPediamuTemp = res;
    }, error => {
      this.loading = false;
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
