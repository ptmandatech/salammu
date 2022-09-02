import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-doa-dzikir',
  templateUrl: './doa-dzikir.page.html',
  styleUrls: ['./doa-dzikir.page.scss'],
})
export class DoaDzikirPage implements OnInit {

  
  listDoaDzikir:any = [];
  listDoaDzikirTemp:any = [];
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
    this.serverImg = this.common.photoBaseUrl+'doadzikir/';
    this.listDoaDzikir = [];
    this.listDoaDzikirTemp = [];
    this.getAllDoaDzikir();
  }

  async doRefresh(event) {
    this.present();
    this.loading = true;
    this.listDoaDzikir = [];
    this.listDoaDzikirTemp = [];
    this.getAllDoaDzikir();
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

  getAllDoaDzikir() {
    this.api.get('Doadzikir?all=ok').then(res => {
      this.listDoaDzikir = res;
      this.listDoaDzikirTemp = res;
    }, error => {
      this.loading = false;
    })
  }

  initializeItems(): void {
    this.listDoaDzikir = this.listDoaDzikirTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listDoaDzikir = this.listDoaDzikir.filter(doaDzikir => {
      if (doaDzikir.title && searchTerm) {
        if (doaDzikir.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        if (doaDzikir.user_name && searchTerm) {
          if (doaDzikir.user_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          if (doaDzikir.summary && searchTerm) {
            if (doaDzikir.summary.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
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
