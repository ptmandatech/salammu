import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-list-hadir',
  templateUrl: './list-hadir.page.html',
  styleUrls: ['./list-hadir.page.scss'],
})
export class ListHadirPage implements OnInit {

  listUsers:any = [];
  listUsersTemp:any = [];
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
    this.serverImg = this.common.photoBaseUrl+'users/';
    this.listUsers = [];
    this.listUsersTemp = [];
    this.getAllUsers();
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

  getAllUsers() {
    this.api.get('users/getAll').then(res => {
      this.listUsers = res;
      console.log(res);
      
    }, error => {
      this.loading = false;
      this.loadingController.dismiss();
    })
  }

}
