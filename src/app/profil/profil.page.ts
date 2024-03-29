import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = require('sweetalert');
import { App } from '@capacitor/app';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  userData:any;
  serverImg:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    private platform: Platform,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit(): void {
    this.serverImg = this.common.photoBaseUrl+'users/';
    this.loginStatus();
    this.checkCurrentVersion();
  }

  infoApp:any = {};
  checkCurrentVersion() {
    this.platform.ready().then(() => {
      App.getInfo().then(res => {
        this.infoApp = res;
      })
    });
  }

  loading:boolean;
  async loginStatus() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      message: 'Mohon Tunggu...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        this.cekLogin();
      });
      this.loading = false;
    });
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.loadingController.dismiss();
    }, error => {
      console.log(error)
      this.loadingController.dismiss();
    })
  }

  logout() {
    swal({
      title: "Anda yakin ingin keluar dari akun ini?",
      icon: "warning",
      buttons: ['Batal', 'Keluar'],
      dangerMode: false,
    })
    .then((open) => {
      if (open) {
        localStorage.removeItem('userSalammu');
        localStorage.removeItem('salammuToken');
        this.router.navigate(['/home']);
      } else {
        console.log('Confirm Batal: blah');
      }
    });
  }

}
