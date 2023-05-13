import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

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
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    let dt = JSON.parse(localStorage.getItem('tafsirSurat-'+this.id));
    this.tafsirSurat = dt == null ? {}:dt;
    if(!this.tafsirSurat || !this.tafsirSurat.nama_latin) {
      this.getTafsirSurat();
    }
    this.cekLogin();
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      this.loadingService.dismiss();
    }, async error => {
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.userData = undefined;
      this.loadingService.dismiss();
    })
  }

  tafsirSurat:any = {};
  async getTafsirSurat() {
    await this.api.get('quran/tafsir/'+this.id).then(res => {
      this.tafsirSurat = res;
      localStorage.setItem('tafsirSurat-'+this.id, JSON.stringify(this.tafsirSurat));
      let dt = JSON.parse(localStorage.getItem('tafsirSurat-'+this.id));
      this.tafsirSurat = dt == null ? {}:dt;
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    })
  }
  
  bacaSurat(n) {
    this.loadingService.present();
    localStorage.setItem('terakhirDibaca', JSON.stringify(n));
    this.router.navigate(['/al-quran/detail-surat', n.nomor]);
    this.loadingService.dismiss();
  }

  bacaTafsir(n) {
    this.loadingService.present();
    this.router.navigate(['/al-quran/tafsir-surat', n.nomor]);
    this.loadingService.dismiss();
  }

}
