import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
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
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listPengajianInfinite = [];
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
    this.listPengajianInfinite = [];
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
      this.api.get('pengajian/getAsAdmin').then(async res => {
        this.listPengajian = res;
        this.listPengajianTemp = res;
        const nextData = this.listPengajian.slice(0, 9);
        this.listPengajianInfinite = await this.listPengajianInfinite.concat(nextData);
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    } else {
      this.api.get('pengajian?created_by='+ this.userData.id).then(async res => {
        this.listPengajian = res;
        this.listPengajianTemp = res;
        const nextData = this.listPengajian.slice(0, 9);
        this.listPengajianInfinite = await this.listPengajianInfinite.concat(nextData);
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    }
    this.loadingService.dismiss();
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listPengajianInfinite.length > 0) {
        startIndex = this.listPengajianInfinite.length;
      }
      const nextData = this.listPengajian.slice(startIndex, this.listPengajianInfinite.length + 9);
      this.listPengajianInfinite = this.listPengajianInfinite.concat(nextData);
      event.target.complete();

      if (this.listPengajianInfinite.length >= this.listPengajian.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  initializeItems(): void {
    this.listPengajian = this.listPengajianTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      const nextData = this.listPengajian.slice(0, 9);
      this.listPengajianInfinite = await this.listPengajianInfinite.concat(nextData);
      return;
    }

    this.listPengajianInfinite = this.listPengajian.filter(pengajian => {
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
      this.listPengajianInfinite = this.listPengajian.filter(pengajian => {
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
