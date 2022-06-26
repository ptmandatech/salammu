import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageUploaderPage } from 'src/app/image-uploader/image-uploader.page';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tambah-video',
  templateUrl: './tambah-video.page.html',
  styleUrls: ['./tambah-video.page.scss'],
})
export class TambahVideoPage implements OnInit {

  videoData:any = {};
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
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'videos/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailVideo();
    }
  }

  getDetailVideo() {
    this.api.get('videos/find/'+this.id).then(res => {
      this.videoData = res;
      this.imageNow = this.serverImg+this.videoData.image;
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
      await this.api.put('videos/uploadfoto',{image: this.image}).then(res=>{
        this.videoData.image = res;
        if(res) {
          this.addVideo();
        }
      }, error => {
        console.log(error)
      });
    } else {
      this.addVideo();
    }
  }

  addVideo() {
    this.videoData.url = this.videoData.url.replace('watch?v=','embed/');
    if(this.isCreated == true) {
      this.api.post('videos', this.videoData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menambahkan video.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-video']);
        }
      })
    } else {
      this.api.put('videos/'+ this.videoData.id, this.videoData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil memperbarui video.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-video']);
        }
      })
    }
  }

  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('videos/'+this.id).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menghapus video.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-video']);
        }
      })
    }
  }

}
