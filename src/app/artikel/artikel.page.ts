import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

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
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.present();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'articles/';
    this.listArticles = [];
    this.listArticlesTemp = [];
    this.getAllArticles();
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

  async doRefresh(event) {
    this.loading = true;
    this.listArticles = [];
    this.listArticlesTemp = [];
    this.getAllArticles();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllArticles() {
    this.api.get('articles?all=ok').then(res => {
      this.listArticles = res;
      this.listArticlesTemp = res;
      this.loading = false;
      this.loadingController.dismiss();
    }, error => {
      this.loading = false;
      this.loadingController.dismiss();
    })
  }

  initializeItems(): void {
    this.listArticles = this.listArticlesTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listArticles = this.listArticles.filter(articles => {
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
