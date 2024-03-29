import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ModalPetaComponent } from 'src/app/pengajian/modal-peta/modal-peta.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-daerah',
  templateUrl: './daerah.page.html',
  styleUrls: ['./daerah.page.scss'],
})
export class DaerahPage implements OnInit {

  id:any;
  isCreated:boolean = true;
  loading:boolean;
  dataDaerah:any = {};
  userData:any;
  listCabang:any = [];
  listCabangTemp:any = [];
  listRanting:any = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.loading = true;
    this.id = this.routes.snapshot.paramMap.get('id');
    this.cekLogin();
    this.getDaerah();
  }

  async doRefresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  cekLogin()
  {
    this.api.me().then(res=>{
      this.userData = res;
      this.loadingService.dismiss();
    }, error => {
      console.log(error);
      this.loadingService.dismiss();
    })
  }

  getDaerah() {
    this.api.get('sicara/find/sicara_pdm/'+this.id).then(res=>{
      this.dataDaerah = res;
      this.loading = false;
      this.getCabang();
    }, err => {
      this.loadingService.dismiss();
    });
  }

  getCabang() {
    this.api.get('sicara/getPCM/'+this.dataDaerah.id).then(res => {
      this.listCabang = res;
      this.listCabangTemp = res;
      if(this.listCabang.length == 0) {
        // this.present();
        this.loading = true;
        this.syncCabang();
      }
      this.loading = false;
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  syncCabang() {
    this.listCabang = [];
    this.api.get('sicara/syncPCMManualByID/'+this.dataDaerah.id).then(res => {
      this.getAfterManualSync();
      this.loading = false;
    }, error => {
      console.log(error)
      this.loading = false;
    })
  }

  getAfterManualSync() {
    this.api.get('sicara/getPCM/'+this.dataDaerah.id).then(res => {
      this.listCabang = res;
      this.listCabangTemp = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  initializeItems(): void {
    this.listCabang = this.listCabangTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listCabang = this.listCabang.filter(data => {
      if (data.nama && searchTerm) {
        if (data.nama.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  getChildRanting(n,idx) {
    this.listRanting = [];
    this.api.get('sicara/getPRM/'+n.id).then(res => {
      this.listRanting = res;
      this.listCabang[idx].jumlah_prm = this.listRanting.length;
      if(this.listRanting.length == 0) {
        // this.present();
        this.loading = true;
        this.syncRanting(n.id);
      }
    }, error => {
      this.loading = false;
    })
  }

  syncRanting(id) {
    this.api.get('sicara/syncPRMManualByID/'+id).then(res => {
      this.listRanting = res;
      this.loading = false;
    }, error => {
      console.log(error)
      this.loading = false;
    })
  }

}
