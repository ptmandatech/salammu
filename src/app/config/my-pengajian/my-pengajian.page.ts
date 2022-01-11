import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

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
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loading = true;
    this.listPengajian = [];
    this.listPengajianTemp = [];
    this.cekLogin();
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      this.getAllPengajian();
    }, async error => {
      this.loading = false;
      this.listPengajian = [];
      this.listPengajianTemp = [];
    })
  }

  getAllPengajian() {
    this.api.get('pengajian?created_by='+ this.userData.id).then(res => {
      this.listPengajian = res;
      this.listPengajianTemp = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
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
      if (pengajian.name && searchTerm) {
        if (pengajian.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
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
