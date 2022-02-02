import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ImageUploaderPage } from 'src/app/image-uploader/image-uploader.page';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tambah-user',
  templateUrl: './tambah-user.page.html',
  styleUrls: ['./tambah-user.page.scss'],
})
export class TambahUserPage implements OnInit {

  userData:any = {};
  loading:boolean;
  id:any;
  serverImg:any;
  imageNow = [];
  isCreated:boolean = true;
  constructor(
    public api: ApiService,
    public router:Router,
    public common: CommonService,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public routes:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'users/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailUser();
    } else {
      this.id = new Date().getTime().toString();
    }
  }

  getDetailUser() {
    this.api.get('users/find/'+this.id).then(res => {
      this.userData = res;
      if(this.userData.editor == 0) {
        this.userData.editor = false;
      } else {
        this.userData.editor = true;
      }
      this.uploadImg = false;
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
  blobImage:any;
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
        this.uploadImg = true;
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

  imgUploaded:any;
  uploadImg:boolean;
  async uploadPhoto()
  {
    if(this.image != undefined) {
      await this.api.put('users/uploadfoto/'+this.userData.id,{image: this.image}).then(res=>{
        this.imgUploaded = res;
        if(this.imgUploaded != undefined) {
          this.userData.image = res;
          this.updateUser();
        }
      }, error => {
        console.log(error)
      });
    } else {
      this.updateUser();
    }
  }

  type = 'password';
  show() {
    this.type == 'password' ? this.type = 'text': this.type = 'password';
  }

  match:boolean;
  checkMatch() {
    this.userData.p2 == this.userData.password ? this.match = true:this.match = false;
  }

  updateUser() {

    this.api.put('users/'+this.id, this.userData).then(res=>{
      this.toastController
      .create({
        message: 'Berhasil memperbarui profil '+this.userData.name +'.',
        duration: 2000,
        color: "primary",
      })
      .then((toastEl) => {
        toastEl.present();
      });
      this.loading = false;
      this.router.navigate(['/user-managements']);
    }, error => {
      console.log(error)
    });
  }

}
