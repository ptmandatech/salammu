import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-my-video',
  templateUrl: './my-video.page.html',
  styleUrls: ['./my-video.page.scss'],
})
export class MyVideoPage implements OnInit {

  listVideos:any = [];
  listVideosTemp:any = [];
  serverImg:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
  ) { }

  ngOnInit() {
    this.serverImg = this.common.photoBaseUrl+'videos/';
  }

  ionViewDidEnter() {
    this.getAllVideos();
  }

  getAllVideos() {
    this.api.get('videos').then(res => {
      this.listVideos = res;
      this.listVideosTemp = res;
    })
  }

}
