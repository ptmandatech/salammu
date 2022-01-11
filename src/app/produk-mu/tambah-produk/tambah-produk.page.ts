import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ImageUploaderPage } from '../../image-uploader/image-uploader.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CommonService } from 'src/app/services/common.service';

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
  constructor(
    public api: ApiService,
    public router:Router,
    public common: CommonService,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    public routes:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'products/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailProduct();
    } else {
      this.id = new Date().getTime().toString();
    }
  }

  getDetailProduct() {
    this.api.get('products/find/'+this.id).then(res => {
      this.productData = res;
      if(this.productData.images != '') {
        this.imageNow = JSON.parse(this.productData.images);
      }
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

  images:any = []
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
        this.images.push(result.data);
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

  imgUploaded:any = [];
  async uploadPhoto()
  {
    if(this.images.length > 0) {
      for(var i=0; i<this.images.length; i++) {
        await this.api.put('products/uploadfoto/'+this.id,{image: this.images[i]}).then(res=>{
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

  addProduct() {
    if(this.isCreated == true) {
      this.productData.images = JSON.stringify(this.imgUploaded);
      this.api.post('products', this.productData).then(res => {
        if(res) {
          alert('Berhasil menambahkan produk.');
          this.loading = false;
          this.router.navigate(['/my-product']);
        }
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
          alert('Berhasil memperbarui produk.');
          this.loading = false;
          this.router.navigate(['/my-product']);
        }
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
          alert('Berhasil menghapus data.');
          this.loading = false;
          this.router.navigate(['/my-product']);
        }
      })
    }
  }

}
