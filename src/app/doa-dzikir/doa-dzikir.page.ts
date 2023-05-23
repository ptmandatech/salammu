import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-doa-dzikir',
  templateUrl: './doa-dzikir.page.html',
  styleUrls: ['./doa-dzikir.page.scss'],
})
export class DoaDzikirPage implements OnInit {

  
  listDoaDzikir:any = [];
  listDoaDzikirTemp:any = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listDoaDzikirInfinite = [];
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
    this.loadingService.present();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'doadzikir/';
    this.listDoaDzikir = [];
    this.listDoaDzikirTemp = [];
    this.getAllDoaDzikir();
  }

  async doRefresh(event) {
    this.loadingService.present();
    this.loading = true;
    this.listDoaDzikir = [];
    this.listDoaDzikirTemp = [];
    this.listDoaDzikirInfinite = [];
    this.getAllDoaDzikir();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllDoaDzikir() {
    this.api.get('Doadzikir?all=ok').then(async res => {
      this.listDoaDzikir = res;
      this.listDoaDzikirTemp = res;
      const nextData = this.listDoaDzikir.slice(0, 9);
      this.listDoaDzikirInfinite = await this.listDoaDzikirInfinite.concat(nextData);
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
      if (this.listDoaDzikirInfinite.length > 0) {
        startIndex = this.listDoaDzikirInfinite.length;
      }
      const nextData = this.listDoaDzikir.slice(startIndex, this.listDoaDzikirInfinite.length + 9);
      this.listDoaDzikirInfinite = this.listDoaDzikirInfinite.concat(nextData);
      event.target.complete();

      if (this.listDoaDzikirInfinite.length >= this.listDoaDzikir.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  initializeItems(): void {
    this.listDoaDzikir = this.listDoaDzikirTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      const nextData = this.listDoaDzikir.slice(0, 9);
      this.listDoaDzikirInfinite = await this.listDoaDzikirInfinite.concat(nextData);
      return;
    }

    this.listDoaDzikirInfinite = this.listDoaDzikir.filter(doaDzikir => {
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
