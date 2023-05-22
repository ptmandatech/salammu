import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ImageUploaderPage } from 'src/app/image-uploader/image-uploader.page';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.page.html',
  styleUrls: ['./edit-profil.page.scss'],
})
export class EditProfilPage implements OnInit {

  form: FormGroup;
  userData:any = {};
  serverImg:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private loadingController: LoadingController,
    public actionSheetController:ActionSheetController,
    private toastController: ToastController,
    private loadingService: LoadingService
  ) { 
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
      address: [null, [Validators.required]],
      cabang: [null],
      ranting: [null],
    });
  }

  async ngOnInit(): Promise<void> {
    this.serverImg = this.common.photoBaseUrl+'users/';
    await this.getListCabang();
    await this.getListRanting();
    this.cekLogin();
  }

  ionViewWillEnter() {
    this.loginStatus();
  }

  loading:boolean;
  async loginStatus() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      message: 'Mohon Tunggu...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        this.cekLogin();
      });
      this.loading = false;
    });
  }

  listCabang:any = [];
  listCabangTemp:any = [];
  gettingCabang:boolean = true;
  async getListCabang() {
    try {
      await this.api.get('sicara/getAllPCM').then(res=>{ 
        this.listCabang = res;
        this.listCabangTemp = res;
        this.gettingCabang = false;
      }, err => {
        this.loading = false;
        this.gettingCabang = false;
      });
    } catch {

    }
  }

  listRanting:any = [];
  listRantingTemp:any = [];
  gettingRanting:boolean = true;
  async getListRanting() {
    try {
      await this.api.get('sicara/getAllPRM').then(res=>{ 
        this.listRanting = res;
        this.listRantingTemp = res;
        this.gettingRanting = false;
      }, err => {
        this.loading = false;
        this.gettingRanting = false;
      });
    } catch {

    }
  }

  async selectEvent(val) {
    this.form.patchValue({
      cabang: val
    })
    this.listRanting = [];
    this.listRantingTemp = [];
    this.gettingRanting = true;
    this.form.patchValue({
      ranting: null
    })
    await this.api.get('sicara/getAllPRM?pcm_id='+val).then(res=>{ 
      this.listRanting = res;
      this.listRantingTemp = res;
      this.gettingRanting = false;
    }, err => {
      this.loading = false;
      this.gettingRanting = false;
    });
  }

  selectEventRanting(val) {
    this.form.patchValue({
      ranting: val
    })
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.form.patchValue({
        name: this.userData.name,
        email: this.userData.email,
        phone: this.userData.phone,
        cabang: this.userData.cabang,
        ranting: this.userData.ranting,
        address: this.userData.address
      });
      this.uploadImg = false;
      this.loadingController.dismiss();
    }, error => {
      this.loadingController.dismiss();
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
    this.loadingService.present();
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
      this.loadingService.dismiss();
    }
    else {
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
  }

  updateUser() {
    this.userData.name = this.form.get('name').value;
    this.userData.email = this.form.get('email').value;
    this.userData.phone = this.form.get('phone').value;
    this.userData.address = this.form.get('address').value;
    this.userData.cabang = this.form.get('cabang').value;
    this.userData.ranting = this.form.get('ranting').value;
    
    this.api.put('users/'+this.userData.id, this.userData).then(res=>{
      this.toastController
      .create({
        message: 'Berhasil memperbarui profil.',
        duration: 2000,
        color: "primary",
      })
      .then((toastEl) => {
        toastEl.present();
      });
      this.loading = false;
      this.router.navigate(['/home']);
      this.loadingService.dismiss();
    }, error => {
      console.log(error)
      this.loadingService.dismiss();
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
