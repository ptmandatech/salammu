import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';
import { HttpClient } from '@angular/common/http';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-tambah-cabang-ranting',
  templateUrl: './tambah-cabang-ranting.page.html',
  styleUrls: ['./tambah-cabang-ranting.page.scss'],
})
export class TambahCabangRantingPage implements OnInit {

  crData:any = {};
  category:any;
  isCreated:boolean = true;
  loading:boolean;
  byPassedHTMLString:any;
  id:any;
  serverImg:any;
  imageNow:any;
  
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public activatedRoute:ActivatedRoute,
    public modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private http:HttpClient
  ) { }

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
              return this.api.postCrImg('cr/uploadfoto/'+this.id, input)
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

  async ngOnInit() {
    this.crData = {};
    this.category = this.activatedRoute.snapshot.paramMap.get('category');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.crData.category = this.category;
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailCr();
    } else {
      this.id = new Date().getTime().toString();
    }
  }

  getDetailCr() {
    this.api.get('cr/find/'+this.id).then(res => {
      this.crData = res;
    })
  }

  save() {
    if(this.isCreated == true) {
      this.api.post('cr', this.crData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menambahkan data.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-cr']);
        }
      })
    } else {
      this.api.put('cr/'+ this.crData.id, this.crData).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil memperbarui data.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-cr']);
        }
      })
    }
  }

  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('cr/'+this.id).then(res => {
        if(res) {
          this.toastController
          .create({
            message: 'Berhasil menghapus data.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading = false;
          this.router.navigate(['/my-cr']);
        }
      })
    }
  }

}
