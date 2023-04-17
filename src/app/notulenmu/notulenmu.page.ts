import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-notulenmu',
  templateUrl: './notulenmu.page.html',
  styleUrls: ['./notulenmu.page.scss'],
})
export class NotulenmuPage implements OnInit {

  listNotulenMu:any = [];
  listNotulenMuTemp:any = [];
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
    this.cekLogin();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    this.listNotulenMu = [];
    this.listNotulenMuTemp = [];
    this.getAllNotulenmu();
  }

  ionViewWillEnter() {
    this.ngOnInit();
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

  userData:any;
  isLoggedIn:boolean = false;
  cekLogin()
  {
    this.api.me().then(async res=>{
      this.userData = res;
      this.isLoggedIn = true;
    }, async error => {
      this.isLoggedIn = false;
    })
  }

  async doRefresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllNotulenmu() {
    this.api.get('notulenmu?all=ok').then(res => {
      this.listNotulenMu = res;
      console.log(res);
      
    }, error => {
      this.loading = false;
      this.loadingController.dismiss();
    })
  }

  initializeItems(): void {
    this.listNotulenMu = this.listNotulenMuTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listNotulenMu = this.listNotulenMu.filter(data => {
      if (data.name && searchTerm) {
        if (data.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  @ViewChild('popover') popover;
  isOpen = false;
  openModalInfo(e:any) {
    this.popover.event = e;
    this.isOpen = true;
  }

}
