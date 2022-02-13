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
    this.id = this.routes.snapshot.paramMap.get('id');
    this.tafsirSurat = JSON.parse(localStorage.getItem('tafsirSurat-'+this.id));
    if(this.tafsirSurat == null) {
      this.getTafsirSurat();
    }
    this.cekLogin();
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

  tafsirSurat:any;
  getTafsirSurat() {
    this.api.getSurat('tafsir/'+this.id).then(res => {
      this.tafsirSurat = res;
      localStorage.setItem('tafsirSurat-'+this.id, JSON.stringify(this.tafsirSurat));
    })
  }

}
