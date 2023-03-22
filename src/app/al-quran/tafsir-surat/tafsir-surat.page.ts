import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tafsir-surat',
  templateUrl: './tafsir-surat.page.html',
  styleUrls: ['./tafsir-surat.page.scss'],
})
export class TafsirSuratPage implements OnInit {

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
    let dt = JSON.parse(localStorage.getItem('tafsirSurat-'+this.id));
    this.tafsirSurat = dt == null ? {}:dt;
    if(!this.tafsirSurat || !this.tafsirSurat.nama_latin) {
      this.getTafsirSurat();
    }
    this.cekLogin();
  }

  loaderCounter = 0;
  async present() {
    this.loaderCounter = this.loaderCounter + 1;
    if(this.loaderCounter == 1){
      this.loading = true;
      return await this.loadingController.create({
        spinner: 'crescent',
        duration: 10000,
        message: 'Sedang menyiapkan data...',
        cssClass: 'custom-class custom-loading'
      }).then(a => {
        a.present().then(() => {
          console.log('presented');
        });
      });
    }
  }

  async dismiss() {
    this.loaderCounter = 0;
    this.loading = false;
    await this.loadingController.dismiss();
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      this.dismiss();
    }, async error => {
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.userData = undefined;
      this.dismiss();
    })
  }

  tafsirSurat:any = {};
  async getTafsirSurat() {
    await this.api.get('quran/tafsir/'+this.id).then(res => {
      this.tafsirSurat = res;
      localStorage.setItem('tafsirSurat-'+this.id, JSON.stringify(this.tafsirSurat));
      let dt = JSON.parse(localStorage.getItem('tafsirSurat-'+this.id));
      this.tafsirSurat = dt == null ? {}:dt;
      this.dismiss();
    }, err => {
      this.dismiss();
    })
  }
  
  bacaSurat(n) {
    this.present();
    localStorage.setItem('terakhirDibaca', JSON.stringify(n));
    this.router.navigate(['/al-quran/detail-surat', n.nomor]);
  }

  bacaTafsir(n) {
    this.present();
    this.router.navigate(['/al-quran/tafsir-surat', n.nomor]);
  }

}
