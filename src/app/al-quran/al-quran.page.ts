import { Component, OnInit } from '@angular/core';
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
  constructor(
    private api: ApiService,
    private loadingController: LoadingController,
    private appComponent: AppComponent,
  ) { }

  async ngOnInit() {
    this.present();
    this.loading = true;
    this.surat = JSON.parse(localStorage.getItem('suratAlQuran'));
    this.suratTemp = this.surat;
    if(this.surat == null) {
      this.getSurat();
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

  async doRefresh(event) {
    if(this.appComponent.networkStatus.connected == true) {
      this.loading = true;
      this.getSurat();
      this.cekLogin();
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
    this.api.getSurat('surat').then(res => {
      console.log(res)
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

}
