import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

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

  openUrl() {
    window.open(this.videoData.url, 'blank');
  }

  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('videos/'+this.id).then(res => {
        if(res) {
          alert('Berhasil menghapus data.');
          this.loading = false;
          this.router.navigate(['/my-video']);
        }
      })
    }
  }
}
