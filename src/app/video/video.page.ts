import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {

  listVideos:any = [];
  listVideosTemp:any = [];
  serverImg:any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
  ) { }

  ngOnInit() {
    this.serverImg = this.common.photoBaseUrl+'videos/';
  }

  ionViewDidEnter() {
    this.loading = true;
    this.getAllVideos();
  }

  getAllVideos() {
    this.api.get('videos').then(res => {
      this.listVideos = res;
      this.listVideosTemp = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  initializeItems(): void {
    this.listVideos = this.listVideosTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listVideos = this.listVideos.filter(video => {
      if (video.title && searchTerm) {
        if (video.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

}
