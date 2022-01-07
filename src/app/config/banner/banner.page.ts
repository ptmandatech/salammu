import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.page.html',
  styleUrls: ['./banner.page.scss'],
})
export class BannerPage implements OnInit {

  listBanners:any = [];
  listBannersTemp:any = [];
  serverImg:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
  ) { }

  ngOnInit() {
    this.serverImg = this.common.photoBaseUrl+'banners/';
  }

  ionViewDidEnter() {
    this.getAllBanners();
  }

  getAllBanners() {
    this.listBanners = [];
    this.listBannersTemp = [];
    this.api.get('banners').then(res => {
      this.listBanners = res;
      this.listBannersTemp = res;
    })
  }

  update(n) {
    this.router.navigate(['/tambah-banner', n.id])
  }

  delete(n) {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('banners/'+n.id).then(res => {
        if(res) {
          alert('Berhasil menghapus data.');
          this.getAllBanners();
        }
      })
    }
  }

}
