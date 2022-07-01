import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageUploaderPage } from 'src/app/image-uploader/image-uploader.page';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-detail-artikel',
  templateUrl: './detail-artikel.page.html',
  styleUrls: ['./detail-artikel.page.scss'],
})
export class DetailArtikelPage implements OnInit {

  articles:any = {};
  loading:boolean;
  id:any;
  serverImg:any;
  @ViewChild('content', { static: false }) content: any;

  constructor(
    public api: ApiService,
    public router:Router,
    public common: CommonService,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    public routes:ActivatedRoute,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'articles/';
    if(this.id != 0) {
      this.getDetailArticles();
    }
  }

  getDetailArticles() {
    this.api.get('articles/find/'+this.id).then(res => {
      this.articles = res;
    })
  }

  scrollIdx = 0;
  autoRead:boolean;
  readContent() {
    this.toastController
    .create({
      message: this.autoRead ? 'Mode baca dinonaktifkan.':'Mode baca diaktifkan.',
      duration: 1000,
      color: this.autoRead ? 'danger':'primary',
    })
    .then((toastEl) => {
      toastEl.present();
    });
    this.autoRead == true ? this.autoRead = false:this.autoRead = true;
    if(this.autoRead) {
      this.scrollToBottom();
    } else {
      this.content.scrollToTop();
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(200000);
    setTimeout(() => {
      if (this.autoRead) {
        this.scrollToBottom();
      }
    }, 200000);
  }

  scrolling(e)
  {
    if(!this.autoRead) {
      this.content.scrollToTop(e.detail.scrollTop);
    }
  }

}
