import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ModalSuratComponent } from '../modal-surat/modal-surat.component';

@Component({
  selector: 'app-detail-surat',
  templateUrl: './detail-surat.page.html',
  styleUrls: ['./detail-surat.page.scss'],
})
export class DetailSuratPage implements OnInit {

  userData:any;
  loading:boolean;
  id:any;
  constructor(
    public api: ApiService,
    public router:Router,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    public routes:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.detailSurat = JSON.parse(localStorage.getItem('detailSurat-'+this.id));
    if(this.detailSurat == null) {
      this.getDetailSurat();
    }
    this.cekLogin();
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

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      await this.loadingController.dismiss();
    }, async error => {
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.userData = undefined;
      await this.loadingController.dismiss();
    })
  }

  detailSurat:any;
  getDetailSurat() {
    this.api.getSurat('surat/'+this.id).then(res => {
      this.detailSurat = res;
      localStorage.setItem('detailSurat-'+this.id, JSON.stringify(this.detailSurat));
    })
  }

  async modalSurat(detailSurat) {
    const modal = await this.modalController.create({
      component: ModalSuratComponent,
      componentProps: {
        detailSurat: detailSurat
      },
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1]
    });
 
    return await modal.present();
  }

}
