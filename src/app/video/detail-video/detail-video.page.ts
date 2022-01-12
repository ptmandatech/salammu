import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

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
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingController: LoadingController,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
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
    }, error => {
      console.log(error);
    })
  }

  getDetailVideo() {
    this.api.get('videos/find/'+this.id).then(res => {
      this.videoData = res;
    })
  }

  urlSafe: SafeResourceUrl;
  unSaveUrl(url) {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return this.urlSafe;
  }

  openUrl() {
    window.open(this.videoData.url, 'blank');
  }
}
