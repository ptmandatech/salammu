import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonDatetime, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ImageUploaderPage } from '../../image-uploader/image-uploader.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CommonService } from 'src/app/services/common.service';
import { format, parseISO } from 'date-fns';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ListHadirPage } from '../list-hadir/list-hadir.page';
import { FormControl } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-tambah-notulenmu',
  templateUrl: './tambah-notulenmu.page.html',
  styleUrls: ['./tambah-notulenmu.page.scss'],
})
export class TambahNotulenmuPage implements OnInit {
  
  loading:boolean;
  id:any;
  serverImg:any;
  isCreated:boolean = true;
  byPassedHTMLString:any;
  userData:any = {};
  notulenData:any = {};
  imageNow = [];
  minDate:any;
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  dateValue = '';
  dataLogin:any = {};
  myControlCabang = new FormControl();
  myControlRanting = new FormControl();
  constructor(
    public api: ApiService,
    public router:Router,
    public common: CommonService,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    private loadingService: LoadingService,
    private toastController: ToastController,
    public routes:ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.getListCabang();
    this.getListRanting();
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.minDate = new Date().toISOString();
    this.cekLogin();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailNotulen();
    } else {
      this.notulenData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
    }
  }

  cekLogin()
  {    
    if(this.dataLogin.cabang_nama) {
      let dt = {
        id: this.dataLogin.cabang_id,
        nama: this.dataLogin.cabang_nama,
        type: 'cabang'
      }
      this.pilihanCR.push(dt);
    }
    if(this.dataLogin.ranting_nama) {
      let dt = {
        id: this.dataLogin.ranting_id,
        nama: this.dataLogin.ranting_nama,
        type: 'ranting'
      }
      this.pilihanCR.push(dt);
    }

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

  selectedCR = '';
  pilihanCR:any = [];
  getDetailNotulen() {
    this.api.get('notulenmu/find/'+this.id).then(res => {
      this.notulenData = res;
      console.log(res);
      
      
      if(this.notulenData.images != '') {
        this.imageNow = JSON.parse(this.notulenData.images);
      }
      if(this.notulenData.datetime) {
        this.dateValue = this.datePipe.transform(new Date(this.notulenData.datetime), 'MMM dd yyyy HH:mm');
      }

      if(this.notulenData.organization_type == 'cabang') {
        this.selectedCR = this.dataLogin.cabang_id;
        this.selectCR();
      }

      if(this.notulenData.organization_type == 'ranting') {
        this.selectedCR = this.dataLogin.ranting_id;
        this.selectCR();
      }
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    })
  }

  selectCR() {
    let idx = this.pilihanCR.findIndex(e => e.id === this.selectedCR);
    if(idx != -1) {
      let data = this.pilihanCR[idx];
      if(data.type == 'cabang') {
        this.notulenData.organization_id = data.id;
        this.notulenData.organization_type = 'cabang';
      } else {
        this.notulenData.organization_id = data.id;
        this.notulenData.organization_type = 'ranting';
      }
    }
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
        this.loadingService.dismiss();
      }, err => {
        this.gettingCabang = false;
        this.loadingService.dismiss();
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
        this.gettingRanting = false;
      });
    } catch {

    }
  }

  selectEvent(val:any) {
    this.selectedCR = val;
  }

  getTitleCabang(cabangID: string) {
    if(cabangID) {
      return this.listCabangTemp.find((data:any) => data.id === cabangID).nama;
    }
  }

  getTitleRanting(rantingID: string) {
    if(rantingID) {
      return this.listRantingTemp.find((data:any) => data.id === rantingID).nama;
    }
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
              return this.api.postCrImg('notulenmu/quilluploadfoto/'+this.id, input)
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

  formatDate(value: string) {
    return format(parseISO(value), 'MMM dd yyyy HH:mm');
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
    this.loadingService.present();
    this.showImageUploader(image.dataUrl, from);
    this.loadingService.dismiss();
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
        this.loadingService.dismiss();
      } 
    });
    return await modal.present();
  }

  removeImg(idx) {
    this.images.splice(idx, 1);
  }

  removeCImg(idx) {
    this.imageNow.splice(idx, 1);
  }

  imgUploaded:any = [];
  async uploadPhoto()
  {
    if(this.images.length > 0) {
      for(var i=0; i<this.images.length; i++) {
        await this.api.put('notulenmu/uploadfoto/'+this.notulenData.id,{image: this.images[i]}).then(res=>{
          this.imgUploaded.push(res);
          if(i+1 == this.images.length) {
            this.addNotulen();
          }
        }, error => {
          console.log(error)
        });
      }
    } else {
      this.addNotulen();
    }
  }

  async openPeserta() { 
    const modal = await this.modalController.create({
      component: ListHadirPage,
      componentProps: {
        id: this.notulenData.id,
        action: 'add',
      },
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.99,
      breakpoints: [0, 0.99, 1]
    });

    modal.onDidDismiss().then(async (result) => {
      if(result.data) {
        this.notulenData.notulenmu_participants = result.data;
      }
    });
    return await modal.present();
  }

  addNotulen() {
    this.notulenData.datetime = new Date(this.dateValue);
    delete this.notulenData.notulenmu_participants;
    if(this.isCreated == true) {
      this.notulenData.images = JSON.stringify(this.imgUploaded);
      this.api.post('notulenmu', this.notulenData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menambahkan data notulen.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/notulenmu']);
        }
      }, err => {
        this.loading = false;
      })
    } else {
      if(this.images.length > 0) {
        this.imgUploaded = this.imgUploaded.concat(this.imageNow);
        this.notulenData.images = '';
        this.notulenData.images = JSON.stringify(this.imgUploaded);
      } else {
        this.notulenData.images = '';
        this.notulenData.images = JSON.stringify(this.imageNow);
      }
      this.api.put('notulenmu/'+ this.notulenData.id, this.notulenData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil memperbarui notulen.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/notulenmu']);
        }
      }, err => {
        this.loading = false;
      })
    }
  }
  
  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.notulenData.isDeleted = 1;
      this.api.put('notulenmu/'+this.id, this.notulenData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menghapus data notulen.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/notulenmu']);
        }
      })
    }
  }

}
