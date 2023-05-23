import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { SweetAlert } from 'sweetalert/typings/core';
import { LoadingService } from '../services/loading.service';
const swal: SweetAlert = require('sweetalert');
@Component({
  selector: 'app-notulenmu',
  templateUrl: './notulenmu.page.html',
  styleUrls: ['./notulenmu.page.scss'],
})
export class NotulenmuPage implements OnInit {

  listNotulenMu:any = [];
  listNotulenMuTemp:any = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listNotulenmuInfinite = [];
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
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.cekLogin();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    this.listNotulenMu = [];
    this.listNotulenMuTemp = [];
  }

  userData:any;
  isLoggedIn:boolean = false;
  cekLogin()
  {
    this.api.me().then(async res=>{
      this.userData = res;
      this.isLoggedIn = true;
      this.parseChip();
      this.getAllNotulenmu();
      this.loadingService.dismiss();
    }, async error => {
      this.isLoggedIn = false;
      this.loadingService.dismiss();
    })
  }

  pilihanChip:any = [];
  parseChip() {
    if(this.userData.role != 'superadmin') {
      if(this.dataLogin.cabang_nama && this.dataLogin.ranting_nama == null) {
        this.pilihanChip = ['Cabang'];
      } else if(this.dataLogin.ranting_nama && this.dataLogin.cabang_nama == null) {
        this.pilihanChip = ['Ranting'];
      } else if(this.dataLogin.ranting_nama && this.dataLogin.cabang_nama) {
        this.pilihanChip = ['Semua', 'Cabang', 'Ranting'];
      }
    } else {
      this.pilihanChip = ['Semua', 'Cabang', 'Ranting'];
    }
  }

  async doRefresh(event) {
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.cekLogin();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    this.listNotulenMu = [];
    this.listNotulenMuTemp = [];
    this.listNotulenmuInfinite = [];
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  selectFilter(m) {
    this.selectedFilter = m;
    this.initializeItems();
    if(this.selectedFilter != 'Semua') {
      this.listNotulenmuInfinite = this.listNotulenMu.filter(data => {
        if (data.organization_type.toLowerCase().indexOf(this.selectedFilter.toLowerCase()) > -1) {
          return true;
        }
      });
    }
  }

  getAllNotulenmu() {
    this.listNotulenMu = [];
    this.listNotulenMuTemp = [];
    if(this.dataLogin) {
      if(this.dataLogin.role == 'superadmin') {
        this.api.get('notulenmu').then(async res => {
          this.listNotulenMu = res;
          this.listNotulenMuTemp = res;
          this.loading = false;
          const nextData = this.listNotulenMu.slice(0, 9);
          this.listNotulenmuInfinite = await this.listNotulenmuInfinite.concat(nextData);
        }, error => {
          this.loading = false;
          this.loadingService.dismiss();
        })
      } else {
        this.api.get('notulenmu?cabang='+this.userData.cabang+'&ranting='+this.userData.ranting).then(async res => {
          this.listNotulenMu = res;
          this.listNotulenMuTemp = res;
          this.loading = false;
          const nextData = this.listNotulenMu.slice(0, 9);
          this.listNotulenmuInfinite = await this.listNotulenmuInfinite.concat(nextData);
        }, error => {
          this.loading = false;
          this.loadingService.dismiss();
        })
      }
    }
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listNotulenmuInfinite.length > 0) {
        startIndex = this.listNotulenmuInfinite.length;
      }
      const nextData = this.listNotulenMu.slice(startIndex, this.listNotulenmuInfinite.length + 9);
      this.listNotulenmuInfinite = this.listNotulenmuInfinite.concat(nextData);
      event.target.complete();

      if (this.listNotulenmuInfinite.length >= this.listNotulenMu.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  initializeItems(): void {
    this.listNotulenMu = this.listNotulenMuTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      const nextData = this.listNotulenMu.slice(0, 9);
      this.listNotulenmuInfinite = await this.listNotulenmuInfinite.concat(nextData);
      return;
    }

    this.listNotulenmuInfinite = this.listNotulenMu.filter(data => {
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
            this.isOpenAction = false;
            this.popoverAction.dismiss();
            this.getAllNotulenmu();
          }
        })
      } else {
        console.log('Confirm Batal: blah');
      }
    });
  }

}
