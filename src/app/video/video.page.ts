import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {

  listVideos:any = [];
  listVideosTemp:any = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listVideoInfinite = [];
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
    this.serverImg = this.common.photoBaseUrl+'videos/';
    this.listVideos = [];
    this.listVideosTemp = [];
    this.loadingService.present();
    this.getAllVideos();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listVideos = [];
    this.listVideosTemp = [];
    this.listVideoInfinite = [];
    this.loadingService.present();
    this.getAllVideos();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllVideos() {
    this.api.get('videos').then(async res => {
      this.listVideos = res;
      this.listVideosTemp = res;
      this.loading = false;
            
      const nextData = this.listVideos.slice(0, 9);
      this.listVideoInfinite = await this.listVideoInfinite.concat(nextData);
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listVideoInfinite.length > 0) {
        startIndex = this.listVideoInfinite.length;
      }
      const nextData = this.listVideos.slice(startIndex, this.listVideoInfinite.length + 9);
      this.listVideoInfinite = this.listVideoInfinite.concat(nextData);
      event.target.complete();

      if (this.listVideoInfinite.length >= this.listVideos.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  initializeItems(): void {
    this.listVideos = this.listVideosTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();
    const searchTerm = evt.srcElement.value;
    
    if (!searchTerm) {
      const nextData = this.listVideos.slice(0, 9);
      this.listVideoInfinite = await this.listVideoInfinite.concat(nextData);
      return;
    }

    this.listVideoInfinite = this.listVideos.filter(video => {
      if (video.title && searchTerm) {
        if (video.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

}
