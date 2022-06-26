import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageUploaderPage } from 'src/app/image-uploader/image-uploader.page';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tambah-banner',
  templateUrl: './tambah-banner.page.html',
  styleUrls: ['./tambah-banner.page.scss'],
})
export class TambahBannerPage implements OnInit {

  bannerData:any = {};
  loading:boolean;
  id:any;
  serverImg:any;
  imageNow:any;
  isCreated:boolean = true;
  constructor(
    public api: ApiService,
    public router:Router,
    public common: CommonService,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    public routes:ActivatedRoute,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'banners/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailBanner();
    }
  }

  getDetailBanner() {
    this.api.get('banners/find/'+this.id).then(res => {
      this.bannerData = res;
      this.imageNow = this.serverImg+this.bannerData.image;
    })
  }

  async pilihFoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih',
      cssClass: 'my-custom-class',
      buttons: [
      {
        text: 'Ambil Foto',
        icon: 'camera-outline',
        handler: () => {
          this.AmbilFoto('photo');
        }
      },
      {
        text: 'Ambil dari Galeri',
        icon: 'image',
        handler: () => {
          this.AmbilFoto('gallery');
        }
      }
    ]
    });
    await actionSheet.present();
  }

  async AmbilFoto(from) {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: (from == 'photo' ? CameraSource.Camera:CameraSource.Photos)
    });
    this.loadingAlert();
    this.showImageUploader(image.dataUrl, from);
  }

  image:any;
  //tampilkan image editor dan uploader
  async showImageUploader(imageData,from) {
    const modal = await this.modalController.create({
      component: ImageUploaderPage,
      componentProps: {
        imageData:imageData
      }
    });    
    modal.onDidDismiss().then(async (result) => {
      if(result)
      {
        this.image = result.data;
      } else {
        this.loadingController.dismiss();
      } 
    });
    return await modal.present();
  }

  async loadingAlert() {
    return await this.loadingController.create({
      spinner: 'crescent',
      message: 'Mohon Tunggu...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        var that = this;
        setTimeout(function () {
          that.loadingController.dismiss();
        }, 3000);
      });
    });
  }

  async uploadPhoto()
  {
    if(this.image != undefined) {
      await this.api.put('banners/uploadfoto',{image: this.image}).then(res=>{
        this.bannerData.image = res;
        if(res) {
          this.addBanner();
        }
      }, error => {
        console.log(error)
      });
    } else {
      this.addBanner();
    }
  }

  addBanner() {
    if(this.isCreated == true) {
      this.api.post('banners', this.bannerData).then(res => {
        if(res) {
          alert('Berhasil menambahkan banner.');
          this.loading = false;
          this.router.navigate(['/banner']);
        }
      })
    } else {
      this.api.put('banners/'+ this.bannerData.id, this.bannerData).then(res => {
        if(res) {
          alert('Berhasil memperbarui banner.');
          this.loading = false;
          this.router.navigate(['/banner']);
        }
      })
    }
  }

}
