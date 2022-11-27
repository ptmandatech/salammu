import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController } from '@ionic/angular';
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
  terakhirDibaca:any;
  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    public router:Router,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public routes:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    let dt = JSON.parse(localStorage.getItem('detailSurat-'+this.id));
    this.detailSurat = dt == null ? {}:dt;
    if(this.detailSurat.nama_latin == undefined) {
      this.getDetailSurat();
    }
    let td = JSON.parse(localStorage.getItem('terakhirDibaca'));
    this.terakhirDibaca = td == null ? {}:td;
    setTimeout(() => {
      if(this.detailSurat && this.terakhirDibaca.terakhirDibaca && this.terakhirDibaca.nomor == this.detailSurat.nomor) {
        this.scrollTo(this.terakhirDibaca.terakhirDibaca.nomor);
      }
    }, 2500);
    this.cekLogin();
  }

  ionViewDidEnter() {
    this.ngOnInit();
  }

  loaderCounter = 0;
  async present() {
    this.loaderCounter = this.loaderCounter + 1;
    if(this.loaderCounter == 1){
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
            this.loading = false;
            this.loaderCounter = 0;
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
        this.loading = false;
      });
    }
  }

  async dismiss() {
    this.loaderCounter = 0;
    this.loading = false;
    await this.loadingController.dismiss();
  }
  
  scrollTo(e:string) {
    setTimeout(() => {
       const element = document.getElementById(e);
       if (element != null) {
          element.scrollIntoView({ behavior: 'smooth' });
       }
    }, 500);
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
    }, async error => {
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.userData = undefined;
    })
  }

  detailSurat:any = {};
  async getDetailSurat() {
    this.present();
    await this.api.get('quran/detailSurat/'+this.id).then(res => {
      this.detailSurat = res;
      localStorage.setItem('detailSurat-'+this.id, JSON.stringify(this.detailSurat));
      let dt = JSON.parse(localStorage.getItem('detailSurat-'+this.id));
      this.detailSurat = dt == null ? {}:dt;
      this.dismiss();
    }, err => {
      this.dismiss();
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

  //bookmark
  async actionAyat(s) {
    const actionSheet = await this.actionSheetController.create({
      header: this.detailSurat.nama_latin,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Tandai Terakhir Dibaca',
        icon: 'book-outline',
        data: 10,
        handler: () => {
          let n = this.detailSurat;
          n.terakhirDibaca = s;
          localStorage.setItem('terakhirDibaca', JSON.stringify(n));
          this.toastController
          .create({
            message: 'Berhasil menandai ayat.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
        }
      }, {
        text: 'Simpan Ayat',
        icon: 'bookmark-outline',
        data: 'Data value',
        handler: () => {
          console.log('Simpan clicked');
          s.created_at = new Date();
          s.surat = this.detailSurat.nama_latin;
          s.surat_id = this.detailSurat.nomor;
          let n = [];
          let dt = JSON.parse(localStorage.getItem('ayatTersimpan'));
          if(!dt || dt.length == 0) {
            n.push(s);
          } else {
            n = dt;
            n.push(s);
          }
          localStorage.setItem('ayatTersimpan', JSON.stringify(n));
          this.toastController
          .create({
            message: 'Berhasil menyimpan ayat.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
        }
      }, {
        text: 'Batalkan',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  bacaSurat(n) {
    this.router.navigate(['/al-quran/detail-surat', n.nomor]);
  }

}
