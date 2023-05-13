import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonDatetime, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { ListHadirPage } from '../list-hadir/list-hadir.page';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { DatePipe } from '@angular/common';
import pdfMake from "pdfmake/build/pdfmake";
import { Device } from '@awesome-cordova-plugins/device/ngx';
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var htmlToPdfmake = require("html-to-pdfmake");
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-detail-notulenmu',
  templateUrl: './detail-notulenmu.page.html',
  styleUrls: ['./detail-notulenmu.page.scss'],
})
export class DetailNotulenmuPage implements OnInit {

  userData:any = {};
  notulenData:any = {};
  id:any;
  serverImg:any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public router:Router,
    public common: CommonService,
    public actionSheetController:ActionSheetController,
    public modalController: ModalController,
    private loadingService: LoadingService,
    private toastController: ToastController,
    public routes:ActivatedRoute,
    private file: File,
    private fileTransfer: FileTransfer,
    private device: Device,
    public datePipe: DatePipe,
    private androidPermissions: AndroidPermissions,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private http: HTTP,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    if(this.id != 0) {
      this.getDetailNotulen();
    }
  } 

  getDetailNotulen() {
    this.api.get('notulenmu/find/'+this.id).then(res => {
      this.notulenData = res;
      if(this.notulenData.images != '') {
        this.notulenData.images = JSON.parse(this.notulenData.images);
      }
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
    })
  }

  loadingExport:boolean;
  pdfObj:any;
  async export(n)
  {
    this.loadingService.present();
    let participants = [];
    let lampiran = [];
    for(var i=0; i<n.notulenmu_participants.length; i++) {
      var nama = n.notulenmu_participants[i].user_name;
      var dt = [
        {text: (i+1) + '. ' + nama, fontSize: 12, marginTop: 8, marginBottom: 8}
      ]
      participants.push(dt);
    }

    for(var i=0; i<n.images.length; i++) {
      var image = this.serverImg+n.images[i];
      let dt = [
        {
          image: await this.getBase64ImageFromURL(image), 
          fontSize: 12, 
          marginTop: 8, 
          marginBottom: 8,
          alignment:'center'
        }
      ]
      lampiran.push(dt);
    }

    var notulen = htmlToPdfmake(n.notulen);

    this.loadingExport = true;
    var dd = {
      content: [
          {
              text:n.title,
              fontSize:14,
              bold:true,
              alignment:'center'
          },
          {
              text: n.organization_nama,
              fontSize:18,
              bold:true,
              alignment:'center',
          },
          {
              text: this.datePipe.transform(new Date(n.datetime).toString(), 'EEEE, dd MMMM yyyy') + '. Jam '+this.datePipe.transform(new Date(n.datetime).toString(), 'H:mm')+'. Di '+n.place,
              fontSize:12,
              alignment:'center',
              marginBottom:30
          },
          {
            table: {
              headerRows: 1,
              widths: [ '*'],
              body: [
                [
                  {
                    bold: true,
                    colSpan: 1,
                    alignment:'center',
                    fontSize: 12,
                    text: "Peserta yang hadir"
                  }
                ],
                [
                  participants
                ]
              ]
            },
            marginBottom:10
          },
          {
            text:'PEMBAHASAN',
            fontSize:14,
            bold:true,
            alignment:'center',
          },
          [
            notulen
          ],
          {
            text:'LAMPIRAN',
            fontSize:14,
            bold:true,
            alignment:'center',
          },
          [
            lampiran
          ],
          {
              text:'Dicetak melalui SalamMU Mobile pada '+this.datePipe.transform(new Date().toString(), 'dd MMMM yyyy H:mm:ss a')+'.',
              alignment:'center',
              marginTop:30,
              fontSize:10,
              italic:true
          }

      ]
    }
    // pdfMake.createPdf(dd).open();
    this.pdfObj = pdfMake.createPdf(dd);
    await this.cekPermissions();
    await this.downloadPdf(n);
    this.loadingExport=false;
  }

  getBase64ImageFromURL(url) {
    const corsAnywhereUrl = 'https://corsproxy.io/?' + url;
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        // Mendapatkan ukuran asli gambar
        const originalWidth = img.width;
        const originalHeight = img.height;
      
        // Menetapkan ukuran baru untuk gambar (50%)
        const newWidth = originalWidth / 2;
        const newHeight = originalHeight / 2;
        
        canvas.width = newWidth;
        canvas.height = newHeight;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, originalWidth, originalHeight, 0, 0, newWidth, newHeight);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        this.loadingService.dismiss();
        let dt = this.getBase64ImageFromURLOtherUrl(url);
        resolve(dt);
      };
      img.src = corsAnywhereUrl;
    });
  }

  getBase64ImageFromURLOtherUrl(url) {
    const corsAnywhereUrl = 'https://proxy.cors.sh/' + url;
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        // Mendapatkan ukuran asli gambar
        const originalWidth = img.width;
        const originalHeight = img.height;
      
        // Menetapkan ukuran baru untuk gambar (50%)
        const newWidth = originalWidth / 2;
        const newHeight = originalHeight / 2;
        
        canvas.width = newWidth;
        canvas.height = newHeight;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, originalWidth, originalHeight, 0, 0, newWidth, newHeight);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        this.toastController
          .create({
            message: JSON.stringify(error),
            duration: 1000,
            color: "danger",
          })
          .then((toastEl) => {
            toastEl.present();
          });
        this.loadingService.dismiss();
        reject(error);
      };
      img.src = corsAnywhereUrl;
    });
  }

  cekPermissions() {
    if (this.device.platform == "Android") {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
      
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
  
      this.file.checkDir(this.file.externalDataDirectory, 'Download').then(res => {
        console.log('sudah ada')
        this.loadingService.dismiss();
      }).catch(error => {
        this.file.createDir(this.file.externalDataDirectory, 'Download', true);
        this.loadingService.dismiss();
      })
    }
  }

  downloadPdf(n) {
    this.loadingService.present();
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    if (this.device.platform == "Android") {
      this.pdfObj.getBuffer(async (buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        var name = 'notulenmu_'+n.title+'.pdf';
        
        await this.file.writeFile(this.file.externalDataDirectory, 'Download/'+name, blob, { replace: true }).then(fileEntry => {
          this.toastController
          .create({
            message: "File dokumen " + name + " berhasil di unduh.",
            duration: 1000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          var msg = name + ' - SalamMU';
          this.socialSharing.share(msg, 'notulenmu', fileEntry.nativeURL).then(() => {
            // Sharing via email is possible
            this.loadingService.dismiss();
          }).catch(() => {
            // Sharing via email is not possible
            this.loadingService.dismiss();
          });
        }).catch(error => {
          this.loadingService.dismiss();
          this.toastController
          .create({
            message: JSON.stringify(error),
            duration: 1000,
            color: "danger",
          })
          .then((toastEl) => {
            toastEl.present();
          });
        })
      });
    } else {
      // On a browser simply use download!
      var name = 'notulenmu_'+n.title+'.pdf';
      this.pdfObj.download(name);
      this.loadingService.dismiss();
    }
  }

  async openPeserta() { 
    const modal = await this.modalController.create({
      component: ListHadirPage,
      componentProps: {
        id: this.notulenData.id,
        action: 'view',
      },
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.99,
      breakpoints: [0, 0.99, 1]
    });

    modal.onDidDismiss().then(async (result) => {
      // if(result.data) {
      //   this.listUsers.push(result.data);
      // }
    });
    return await modal.present();
  }

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    spaceBetween: 20,
    autoplay: true
  };
  
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
