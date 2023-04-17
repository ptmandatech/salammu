import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonDatetime, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-detail-notulenmu',
  templateUrl: './detail-notulenmu.page.html',
  styleUrls: ['./detail-notulenmu.page.scss'],
})
export class DetailNotulenmuPage implements OnInit {

  userData:any = {};
  notulenData:any = {};
  id:any;
  serverImg:any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public router:Router,
    public common: CommonService,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public routes:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    if(this.id != 0) {
      this.getDetailNotulen();
    }
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
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
          this.loading = false;
        }
      });
      this.loading = false;
    });
  }

  getDetailNotulen() {
    this.api.get('notulenmu/find/'+this.id).then(res => {
      this.notulenData = res;
      console.log(res);
      
    })
  }

}
