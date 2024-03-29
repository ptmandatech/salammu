import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-my-video',
  templateUrl: './my-video.page.html',
  styleUrls: ['./my-video.page.scss'],
})
export class MyVideoPage implements OnInit {

  listVideos:any = [];
  listVideosTemp:any = [];
  serverImg:any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingService.present();
    this.serverImg = this.common.photoBaseUrl+'videos/';
    this.listVideos = [];
    this.listVideosTemp = [];
    this.getAllVideos();
  }

  onDidViewEnter() {
    this.loading = true;
    this.listVideos = [];
    this.listVideosTemp = [];
    this.getAllVideos();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listVideos = [];
    this.listVideosTemp = [];
    this.loadingService.present();
    this.getAllVideos();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllVideos() {
    this.api.get('videos').then(res => {
      this.listVideos = res;
      this.listVideosTemp = res;
      this.loading = false;
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
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
