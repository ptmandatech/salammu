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
    this.api.get('banners').then(res => {
      this.listBanners = res;
      this.listBannersTemp = res;
      console.log(this.listBanners)
    })
  }

}
