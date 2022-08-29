import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';


@Component({
  selector: 'app-radiomu',
  templateUrl: './radiomu.page.html',
  styleUrls: ['./radiomu.page.scss'],
})
export class RadiomuPage implements OnInit {

  listRadiomu:any = [];
  listRadiomuTemp:any = [];
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
    this.serverImg = this.common.photoBaseUrl+'radiomu/';
    this.listRadiomu = [];
    this.listRadiomuTemp = [];
    this.getAllRadiomu();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listRadiomu = [];
    this.listRadiomuTemp = [];
    this.present();
    this.getAllRadiomu();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async present() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      duration: 10000,
      message: 'Tunggu Sebentar...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
          this.loading = false;
        }
      });
      this.loading = false;
    });
  }

  getAllRadiomu() {
    this.api.get('radiomu').then(res => {
      this.listRadiomu = res;
      console.log(res)
      this.listRadiomuTemp = res;
    }, error => {
      this.loading = false;
    })
  }

  initializeItems(): void {
    this.listRadiomu = this.listRadiomuTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listRadiomu = this.listRadiomu.filter(articles => {
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
