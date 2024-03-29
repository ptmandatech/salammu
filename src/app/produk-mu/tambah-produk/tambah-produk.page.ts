import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ImageUploaderPage } from '../../image-uploader/image-uploader.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CommonService } from 'src/app/services/common.service';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/app/services/loading.service';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-tambah-produk',
  templateUrl: './tambah-produk.page.html',
  styleUrls: ['./tambah-produk.page.scss'],
})
export class TambahProdukPage implements OnInit {
  
  productData:any = {};
  loading:boolean;
  id:any;
  serverImg:any;
  imageNow = [];
  isCreated:boolean = true;
  byPassedHTMLString:any;
  userData:any = {};
  constructor(
    public api: ApiService,
    public router:Router,
    public common: CommonService,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    private loadingService: LoadingService,
    private toastController: ToastController,
    public routes:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.getCategories();
    this.cekLogin();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'products/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailProduct();
    } else {
      this.productData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
    }
  }

  allCategories:any = [];
  getCategories() {
    this.api.get('categories').then(res=>{
      this.allCategories = res;
      this.allCategories = this.allCategories.sort((a:any,b:any) => a.name < b.name ? -1:1)
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    });
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      this.loadingService.dismiss();
    }, async error => {
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.userData = undefined;
      this.loadingService.dismiss();
    })
  }

  getDetailProduct() {
    this.api.get('products/find/'+this.id).then(res => {
      this.productData = res;
      if(this.productData.images != '') {
        this.imageNow = JSON.parse(this.productData.images);
      }
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    })
  }

  modules = {
    toolbar: [
      ['image', 'video']
    ],
    imageHandler: {
      upload: (file) => {
        return new Promise(async (resolve, reject) => {
          if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') { // File types supported for image
            if (file.size < 1000000) { // Customize file size as per requirement
            
            // Sample API Call
              let input = new FormData();
              input.append('file', file);
              // let image;
              // this.base64.encodeFile(file)
              //         .then((base64File: string) => {
              //   image = base64File;
              //   console.log(image)
              // }, (err) => {
              //   alert('err '+ err);
              // });
              return this.api.postCrImg('products/quilluploadfoto/'+this.id, input)
                .then(result => {
                  resolve(this.common.serverImgPath+result); // RETURN IMAGE URL from response
                })
                .catch(error => {
                  reject('Upload failed'); 
                  // Handle error control
                  console.error('Error:', error);
                });
            } else {
              reject('Size too large');
            // Handle Image size large logic 
            }
          } else {
            reject('Unsupported type');
          // Handle Unsupported type logic
          }
        });
      },
      accepts: ['png', 'jpg', 'jpeg', 'jfif'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
    } as Options
  };


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
    this.loadingService.present();
    this.showImageUploader(image.dataUrl, from);
  }

  images:any = []
  blobImage:any;
  //tampilkan image editor dan uploader
  async showImageUploader(imageData,from) {
    this.loadingService.dismiss();
    const modal = await this.modalController.create({
      component: ImageUploaderPage,
      componentProps: {
        imageData:imageData
      }
    });    
    modal.onDidDismiss().then(async (result) => {
      if(result)
      {
        this.images.push(result.data);
      } else {
        this.loadingService.dismiss();
      } 
    });
    return await modal.present();
  }

  imgUploaded:any = [];
  async uploadPhoto()
  {
    this.loadingService.present();
    if(this.productData.price <= 0) {
      this.toastController
      .create({
        message: 'Masukkan harga produk!',
        duration: 2000,
        color: "danger",
      })
      .then((toastEl) => {
        toastEl.present();
      });
      return;
    } else {
      if(this.images.length > 0) {
        for(var i=0; i<this.images.length; i++) {
          await this.api.put('products/uploadfoto/'+this.productData.id,{image: this.images[i]}).then(res=>{
            this.imgUploaded.push(res);
            if(i+1 == this.images.length) {
              this.addProduct();
            }
          }, error => {
            console.log(error)
          });
        }
      } else {
        this.addProduct();
      }
    }
  }

  addProduct() {
    if(this.isCreated == true) {
      this.productData.verified = false;
      this.productData.images = JSON.stringify(this.imgUploaded);
      this.api.post('products', this.productData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menambahkan produk.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-product']);
        }
      }, err => {
        this.loading = false;
      })
    } else {
      if(this.images.length > 0) {
        this.imgUploaded = this.imgUploaded.concat(this.imageNow);
        this.productData.images = '';
        this.productData.images = JSON.stringify(this.imgUploaded);
      } else {
        this.productData.images = '';
        this.productData.images = JSON.stringify(this.imageNow);
      }
      
      this.api.put('products/'+ this.productData.id, this.productData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil memperbarui produk.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.loadingService.dismiss();
          this.router.navigate(['/my-product']);
        }
      }, err => {
        this.loading = false;
      })
    }
  }

  removeImg(idx) {
    this.images.splice(idx, 1);
  }

  removeCImg(idx) {
    this.imageNow.splice(idx, 1);
  }

  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('products/'+this.id).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menghapus data produk.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-product']);
        }
      })
    }
  }

  verifikasi() {
    this.loading = true;
    var conf = confirm('Anda yakin ingin melanjutkan verifikasi produk?');
    if (conf) {
      this.productData.verified = true;
      this.api.put('products/'+ this.productData.id, this.productData).then(res => {
        if(res) {
          this.loading = false;
          this.toastController
          .create({
            message: 'Berhasil memverifikasi produk.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-product']);
        }
      }).catch(error => {
        this.loading = false;
      })
    } else {
      this.loading = false;
    }
  }

}
