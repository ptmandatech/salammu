import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { ActionSheetController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-ayat-tersimpan',
  templateUrl: './ayat-tersimpan.page.html',
  styleUrls: ['./ayat-tersimpan.page.scss'],
})
export class AyatTersimpanPage implements OnInit {

  userData:any;
  loading:boolean;
  ayatTersimpan:any;
  constructor(
    private api: ApiService,
    public actionSheetController:ActionSheetController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private appComponent: AppComponent,
    private router: Router
  ) { }

  async ngOnInit() {
    this.present();
    this.loading = true;
    let dt = JSON.parse(localStorage.getItem('ayatTersimpan'));
    this.ayatTersimpan = dt == null ? []:dt;
    this.cekLogin();
  }

  ionViewDidEnter() {
    this.ngOnInit();
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

  async doRefresh(event) {
    if(this.appComponent.networkStatus.connected == true) {
      this.loading = true;
      this.ngOnInit();
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    } else {
      this.appComponent.cekKoneksi();
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }
  }

  //bookmark
  async actionAyat(n, idx) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Aksi Ayat Tersimpan',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Lihat Ayat Tersimpan',
        icon: 'book-outline',
        data: 10,
        handler: () => {
          console.log('Lihat clicked');
          this.present();
          this.getDetailSurat(n);
        }
      }, {
        text: 'Hapus Ayat',
        icon: 'trash-outline',
        data: 'Data value',
        handler: () => {
          console.log('Hapus clicked');
          this.ayatTersimpan = this.ayatTersimpan.splice(1, idx);
          localStorage.setItem('ayatTersimpan', JSON.stringify(this.ayatTersimpan));
          this.toastController
          .create({
            message: 'Berhasil menghapus ayat tersimpan.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.ngOnInit();
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

  detailSurat:any = {};
  async getDetailSurat(n) {
    await this.api.getSurat('surat/'+n.surat_id).then(res => {
      this.detailSurat = res;
      localStorage.setItem('detailSurat-'+n.surat_id, JSON.stringify(this.detailSurat));
      let dt = JSON.parse(localStorage.getItem('detailSurat-'+n.surat_id));
      this.detailSurat = dt == null ? {}:dt;

      let aa = this.detailSurat;
      aa.terakhirDibaca = n;
      localStorage.setItem('terakhirDibaca', JSON.stringify(aa));
      this.bacaSurat(this.detailSurat);
    }, err => {
    })
  }

  bacaSurat(n) {
    console.log(n)
    this.router.navigate(['/al-quran/detail-surat', n.nomor]);
  }
}
