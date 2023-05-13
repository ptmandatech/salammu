import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import {IonSlides} from '@ionic/angular';
import SwiperCore, { SwiperOptions } from 'swiper';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-detail-produk',
  templateUrl: './detail-produk.page.html',
  styleUrls: ['./detail-produk.page.scss'],
})
export class DetailProdukPage implements OnInit {
  
  config: SwiperOptions = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  detailProduct:any;
  serverImg: any;
  id:any;
  @ViewChild(IonSlides) slides: IonSlides;
  
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingService: LoadingService,
  ) { }

  loading:boolean;
  ngOnInit() {
    this.loadingService.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.getDetailProduct();
  }

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    spaceBetween: 20,
    autoplay: true
  };

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
  
  getDetailProduct() {
    this.api.get('products/find/'+this.id).then(res => {
      this.parseImage(res);
    }, err => {
      this.loadingService.dismiss();
    })
  }

  parseImage(res) {
    let images = JSON.parse(res.images);
    if(images.length > 0 && images != null && images != '') {
      res.images = images;
      this.detailProduct = res;
    } else {
      res.images = [];
      this.detailProduct = res;
    }
    this.getDetailOwner();
    this.loadingService.dismiss();
  }

  ownerData:any;
  getDetailOwner() {
    this.api.get('users/find/'+this.detailProduct.created_by).then(res => {
      this.ownerData = res;
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    })
  }

  chatSeller() {
    this.api.chatSeller(this.ownerData, this.detailProduct);
  }

  ionSlideTouchEnd(){
    // Lock the ability to slide to the next or previous slide.
    this.slides.lockSwipes(true);
}

  async openViewer(url) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: url
      },
      cssClass: 'ion-img-viewer'
    });
 
    return await modal.present();
  }

}
