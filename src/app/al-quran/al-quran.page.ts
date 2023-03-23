import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-al-quran',
  templateUrl: './al-quran.page.html',
  styleUrls: ['./al-quran.page.scss'],
})
export class AlQuranPage implements OnInit {

  defaultSegment:any='surah';
  userData:any;
  loading:boolean;
  terakhirDibaca:any;
  constructor(
    private api: ApiService,
    private loadingController: LoadingController,
    private appComponent: AppComponent,
    private router: Router
  ) { }

  async ngOnInit() {
    // this.present();
    this.surat = JSON.parse(localStorage.getItem('suratAlQuran'));
    this.terakhirDibaca = JSON.parse(localStorage.getItem('terakhirDibaca'));
    this.suratTemp = this.surat;
    if(this.surat == null) {
      this.getSurat();
    }
    this.cekLogin();
  }

  ionViewDidEnter() {
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

  surat:any = [];
  suratTemp:any = [];
  getSurat() {
    this.loading = true;
    this.surat = [];
    this.suratTemp = [];
    this.api.get('quran/surat').then(res => {
      this.surat = res;
      this.suratTemp = res;
      localStorage.setItem('suratAlQuran', JSON.stringify(this.surat));
    })
  }

  initializeItems(): void {
    this.surat = this.suratTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.surat = this.surat.filter(surat => {
      if (surat.nama_latin && searchTerm) {
        if (surat.nama_latin.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  bacaSurat(n) {
    if(this.terakhirDibaca) {
      if(this.terakhirDibaca.nomor == n.nomor) {
        this.lanjutBacaSurat(n);
      } else {
        localStorage.setItem('terakhirDibaca', JSON.stringify(n));
        this.router.navigate(['/al-quran/detail-surat', n.nomor]);
      }
    } else {
      localStorage.setItem('terakhirDibaca', JSON.stringify(n));
      this.router.navigate(['/al-quran/detail-surat', n.nomor]);
    }
  }

  lanjutBacaSurat(n) {
    this.router.navigate(['/al-quran/detail-surat', n.nomor]);
  }

}
