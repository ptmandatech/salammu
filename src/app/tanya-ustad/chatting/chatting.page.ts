import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageUploaderPage } from 'src/app/image-uploader/image-uploader.page';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.page.html',
  styleUrls: ['./chatting.page.scss'],
})
export class ChattingPage implements OnInit {

  newMsg = '';
  @ViewChild(IonContent, {static: false}) content: IonContent;
  data:any = {};
  roomData:any;
  loading:boolean;
  listChats:any = [];
  userData:any = {};
  serverImg: any;

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    public common: CommonService,
    private http: HttpClient,
    public modalController: ModalController,
    private loadingController: LoadingController,
    public actionSheetController: ActionSheetController
  ) { 
    this.serverImg = this.common.photoBaseUrl+'chattings/';
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.data) {
        this.data = JSON.parse(data.data);
      }
    });
  }

  async ngOnInit() {
    this.present();
    await this.cekLogin();
  }

  async present() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      duration: 10000,
      message: 'Tunggu Sebentar...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
          this.loading = false;
        }
      });
      this.loading = false;
    });
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.checkRoom();
      this.loadingController.dismiss();
    }, error => {
      this.loadingController.dismiss();
    })
  }

  checkRoom() {
    console.log(this.data)
    this.api.post('chattings/checkRooms', this.data).then(res => {
      console.log(res)
      this.checkResult(res);
    })
  }

  roomExist:boolean;
  isUstad:boolean = false;
  checkResult(res) {
    if(res == 'not_exist') {
      this.roomExist = false;
    } else {
      this.roomExist = true;
      this.roomData = res;
      console.log(this.roomData)
      if(this.roomData.ustadz_id == this.userData.id) {
        this.isUstad = true;
      } else {
        this.isUstad = false;
      }
      this.getChats();
    }

    if(this.newMsg != '') {
      this.uploadPhoto();
    }
  }

  createRooms() {
    this.data.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))],
    this.api.post('chattings/rooms', this.data).then(res => {
      this.checkRoom();
    })
  }

  getChats() {
    this.api.get('chattings/getChats/'+this.roomData.id).then(res => {
      this.listChats = res;
      console.log(res)
      setTimeout(() => {
        this.content.scrollToBottom(400);
      }, 1000);
    })
  }

  imagePath:any;
  async uploadPhoto()
  {
    let id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
    if(this.image) {
      await this.api.put('chattings/uploadfoto/'+id,{image: this.image}).then(res=>{
        this.imagePath = res;
        console.log(res)
        this.sendMessage(id);
      }, error => {
        console.log(error)
      });
    } else {
      this.sendMessage(id);
    }
  }

  sendMessage(id) {
    if(this.roomExist) {
      let dt = {
        id: id,
        created_by: this.userData.id,
        room_id: this.roomData.id,
        messages: this.newMsg,
        image: this.image == null ? null:this.imagePath,
        ustad_already_read: this.roomData.ustadz_id == this.userData.id ? true:false,
        user_already_read: this.roomData.ustadz_id != this.userData.id ? true:false,
        type: this.image == null ? 'text':'image'
      }
  
      this.api.post('chattings/chats', dt).then(res => {
        console.log(res)
        this.sendNotif();
        this.getChats();
  
        this.newMsg = '';
        this.image = null;
      });
    } else {
      this.createRooms();
    }
  }

  image:any;
  async lampiran() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih',
      buttons: [{
        text: 'Galeri',
        icon: 'image',
        handler: () => {
          console.log('Album');
          this.AmbilGallery();
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log('Foto');
          this.AmbilFoto();
        }
      }]
    });
    await actionSheet.present();
  }

  async AmbilFoto() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    this.showImageUploader(image.dataUrl);
  }

  async AmbilGallery() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
    this.showImageUploader(image.dataUrl);
  }

  //tampilkan image editor dan uploader
  async showImageUploader(imageData) {
    const modal = await this.modalController.create({
      component: ImageUploaderPage,
      componentProps: {
        imageData:imageData,
        from: 'chat'
      }
    });    
    modal.onDidDismiss().then((data) => {
      console.log(data)
      this.image = data.data;
    });
    return await modal.present();
  }

  //notifikasi
  url_notif = 'https://fcm.googleapis.com/fcm/send';

  sendNotif() {
    let data = {
      "notification" : {
        "title": "SalamMU - " + this.isUstad ? this.roomData.ustadz_name:this.roomData.user_name,
        "body":this.newMsg,
        "sound":"default",
        "icon":"logo"
      },
      "data": {
        "ustadz_id": this.roomData.ustadz_id,
        "ustadz_name": this.roomData.ustadz_name,
        "user_id": this.roomData.user_id,
        "room_id":this.roomData.id,
      },
      "to": this.isUstad ? this.roomData.tokenUser : this.roomData.tokenUstad,
      "priority":"high",
      "restricted_package_name":""
    };

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `key=AAAAfUgqfM0:APA91bE2AsdIjPXxbQmvzOqkXfcNoREowKF__oE4P8GJUEcXPYuZb78cMd_S7Os5fnXPskvY6RHDuJs4Af5G-gkSAw0uOZHXnt_BYfczS_zPuDy6k9DomFfI1TWuv-OILopIrqxznJXv`
    });

    this.http.post(this.url_notif, data, { headers }).subscribe( res => {
    });
  }

}
