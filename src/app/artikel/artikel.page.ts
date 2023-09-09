import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-artikel',
  templateUrl: './artikel.page.html',
  styleUrls: ['./artikel.page.scss'],
})
export class ArtikelPage implements OnInit {

  listArticles:any = [];
  listArticlesTemp:any = [];
  serverImg: any;
  loading:boolean;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listArtikelInfinite = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    // private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    // this.loadingService.present();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'articles/';
    this.listArticles = [];
    this.listArticlesTemp = [];
    this.getAllArticles();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listArticles = [];
    this.listArticlesTemp = [];
    this.listArtikelInfinite = [];
    // this.loadingService.present();
    this.getAllArticles();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllArticles() {
    this.api.get('articles?all=ok').then(async res => {
      this.listArticles = res;
      this.listArticlesTemp = res;
      this.loading = false;
      const nextData = this.listArticles.slice(0, 9);
      this.listArtikelInfinite = await this.listArtikelInfinite.concat(nextData);
      // this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      // this.loadingService.dismiss();
    })
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listArtikelInfinite.length > 0) {
        startIndex = this.listArtikelInfinite.length;
      }
      const nextData = this.listArticles.slice(startIndex, this.listArtikelInfinite.length + 9);
      this.listArtikelInfinite = this.listArtikelInfinite.concat(nextData);
      event.target.complete();

      if (this.listArtikelInfinite.length >= this.listArticles.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  initializeItems(): void {
    this.listArticles = this.listArticlesTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      const nextData = this.listArticles.slice(0, 9);
      this.listArtikelInfinite = await this.listArtikelInfinite.concat(nextData);
      return;
    }

    this.listArtikelInfinite = this.listArticles.filter(articles => {
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
