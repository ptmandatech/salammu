import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-detail-video',
  templateUrl: './detail-video.page.html',
  styleUrls: ['./detail-video.page.scss'],
})
export class DetailVideoPage implements OnInit {

  videoData:any = {};
  id:any;
  isCreated:boolean = true;
  loading:boolean;
  serverImg:any;
  userData:any;
  loadingIframe = 'https://cdn.dribbble.com/users/2973561/screenshots/5757826/media/221d6bfc1960ab98a7585fcc2a4d0181.gif';
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingService: LoadingService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.cekLogin();
    this.serverImg = this.common.photoBaseUrl+'videos/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailVideo();
    }
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

  getDetailVideo() {
    this.api.get('videos/find/'+this.id).then(res => {
      this.videoData = res;
      this.unSaveUrl(this.videoData.url);
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    })
  } 

  urlSafe: SafeResourceUrl;
  async unSaveUrl(url) {
    this.urlSafe = await this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openUrl() {
    window.open(this.videoData.url, 'blank');
  }
}
