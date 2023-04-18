import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = require('sweetalert');
@Component({
  selector: 'app-notulenmu',
  templateUrl: './notulenmu.page.html',
  styleUrls: ['./notulenmu.page.scss'],
})
export class NotulenmuPage implements OnInit {

  listNotulenMu:any = [];
  listNotulenMuTemp:any = [];
  serverImg: any;
  loading:boolean;
  selectedFilter:any = 'Semua';
  dataLogin:any = {};
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.present();
    this.cekLogin();
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    this.listNotulenMu = [];
    this.listNotulenMuTemp = [];
    this.getAllNotulenmu();
  }

  ionViewWillEnter() {
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
      });
      this.loading = false;
    });
  }

  userData:any;
  isLoggedIn:boolean = false;
  cekLogin()
  {
    this.api.me().then(async res=>{
      this.userData = res;
      this.isLoggedIn = true;
    }, async error => {
      this.isLoggedIn = false;
    })
  }

  async doRefresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  selectFilter(m) {
    this.selectedFilter = m;
  }

  getAllNotulenmu() {
    this.api.get('notulenmu?all=ok').then(res => {
      this.listNotulenMu = res;
      this.listNotulenMuTemp = res;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.loadingController.dismiss();
    })
  }

  initializeItems(): void {
    this.listNotulenMu = this.listNotulenMuTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listNotulenMu = this.listNotulenMu.filter(data => {
      if (data.title && searchTerm) {
        if (data.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        if (data.notulen && searchTerm) {
          if (data.notulen.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
        return false;
      }
    });
  }

  @ViewChild('popover') popover;
  isOpen = false;
  openModalInfo(e:any) {
    this.popover.event = e;
    this.isOpen = true;
  }

  @ViewChild('popoverAction') popoverAction;
  selectedAction:any = {};
  isOpenAction = false;
  openAction(e:any, n:any) {
    this.selectedAction = n;
    this.popoverAction.event = e;
    this.isOpenAction = true;
  }

  detailNotulen() {
    this.isOpenAction = false;
    this.popoverAction.dismiss();
    this.router.navigate(['/notulenmu/detail-notulenmu', this.selectedAction.id]);
  }
  
  perbaruiNotulen() {
    this.isOpenAction = false;
    this.popoverAction.dismiss();
    this.router.navigate(['/notulenmu/tambah-notulenmu', this.selectedAction.id]);
  }

  deleteNotulen() {
    swal({
      title: "Hapus data notulen?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      buttons: ['Batal', 'Hapus'],
      dangerMode: false,
    })
    .then((open) => {
      if (open) {
        this.selectedAction.isDeleted = 1;
        this.api.put('notulenmu/'+this.selectedAction.id, this.selectedAction).then(res => {
          if(res) {
            this.toastController
            .create({
              message: 'Berhasil menghapus data notulen.',
              duration: 2000,
              color: "primary",
            })
            .then((toastEl) => {
              toastEl.present();
            });
            this.loading = false;
            this.getAllNotulenmu();
          }
        })
      } else {
        console.log('Confirm Batal: blah');
      }
    });
  }

}