import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-my-pengajian',
  templateUrl: './my-pengajian.page.html',
  styleUrls: ['./my-pengajian.page.scss'],
})
export class MyPengajianPage implements OnInit {

  listPengajian:any = [];
  listPengajianTemp:any = [];
  userData:any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingService.present();
  }

  ionViewWillEnter() {
    this.listPengajian = [];
    this.listPengajianTemp = [];
    this.cekLogin();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listPengajian = [];
    this.listPengajianTemp = [];
    this.loadingService.present();
    this.cekLogin();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      if(this.userData.role == 'superadmin') {
        this.getUsers();
      }
      this.getAllPengajian();
    }, async error => {
      this.loading = false;
      this.listPengajian = [];
      this.listPengajianTemp = [];
      this.loadingService.dismiss();
    })
  }

  users:any = {};
  getUsers() {
    this.api.get('users').then(res => {
      this.parseUser(res);
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  parseUser(res) {
    for(var i=0; i<res.length; i++) {
      this.users[res[i].id] = res[i];
    }
    this.loadingService.dismiss();
  }

  getAllPengajian() {
    if(this.userData.role == 'superadmin') {
      this.api.get('pengajian/getAsAdmin').then(res => {
        this.listPengajian = res;
        this.listPengajianTemp = res;
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    } else {
      this.api.get('pengajian?created_by='+ this.userData.id).then(res => {
        this.listPengajian = res;
        this.listPengajianTemp = res;
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    }
    this.loadingService.dismiss();
  }

  initializeItems(): void {
    this.listPengajian = this.listPengajianTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listPengajian = this.listPengajian.filter(pengajian => {
      if (pengajian.name && pengajian.location && searchTerm) {
        if (pengajian.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        } else if (pengajian.location.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  filterData(status) {
    if(status == 'all') {
      this.initializeItems();
    } else {
      this.initializeItems();
      this.listPengajian = this.listPengajian.filter(pengajian => {
        if (pengajian.status) {
          if (pengajian.status == status) {
            return true;
          }
          return false;
        }
      });
    }
  }

}
