import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ApiService } from '../services/api.service';
import { LoadingService } from '../services/loading.service';

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
    private router: Router,
    private loadingService: LoadingService
  ) { }

  async ngOnInit() {
    // this.present();
  }

  ionViewDidEnter() {
    this.surat = JSON.parse(localStorage.getItem('suratAlQuran'));
    this.terakhirDibaca = JSON.parse(localStorage.getItem('terakhirDibaca'));
    this.suratTemp = this.surat;
    if(this.surat == null) {
      this.getSurat();
    } else {
      let detailSuratSaved = localStorage.getItem('detailSuratSaved');
      if(!detailSuratSaved){
        this.parseDataSurat();
      }
    }
    this.cekLogin();
  }

  cekLogin()
  {
    this.api.me().then(async res=>{
      this.userData = res;
      this.loading = false;
    }, async error => {
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.userData = undefined;
    })
  }

  async doRefresh(event) {
    if(this.appComponent.networkStatus.connected == true) {
      this.loading = true;
      this.surat = JSON.parse(localStorage.getItem('suratAlQuran'));
      this.terakhirDibaca = JSON.parse(localStorage.getItem('terakhirDibaca'));
      this.suratTemp = this.surat;
      if(this.surat == null) {
        this.getSurat();
      } else {
        let detailSuratSaved = localStorage.getItem('detailSuratSaved');
        if(!detailSuratSaved){
          this.parseDataSurat();
        }
      }
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
    this.loading = true;
    this.loadingService.present();
    this.surat = [];
    this.suratTemp = [];
    this.api.get('quran/surat').then(res => {
      this.surat = res;
      this.suratTemp = res;
      let detailSuratSaved = localStorage.getItem('detailSuratSaved');
      if(!detailSuratSaved){
        this.parseDataSurat();
      }
      localStorage.setItem('suratAlQuran', JSON.stringify(this.surat));
    })
  }

  parseDataSurat() {
    this.loadingService.present();
    this.api.post('quran/getDetailSurat', this.surat).then(res => {
      this.parseDetailSurat(res);
    }, err => {
      this.loadingService.dismiss();
    })
  }

  parseDetailSurat(res) {
    if(res){
      for(var i = 0; i < res.length; i++) {
        localStorage.setItem('detailSurat-'+res[i].nomor, JSON.stringify(res[i]));
        if(i+1 == res.length){
          localStorage.setItem('detailSuratSaved', 'true');
          this.loadingService.dismiss();
        }
      }
    }
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
