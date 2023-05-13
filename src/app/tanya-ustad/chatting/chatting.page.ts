import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageUploaderPage } from 'src/app/image-uploader/image-uploader.page';
import { CommonService } from 'src/app/services/common.service';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
// import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';

import * as chatActions from '../../store/actions/chat/chat.actions';
import * as chatSelectors from '../../store/selectors/chat/chat.selectors';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
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
  serverImgUser: any;
  public roomId: number = 123;
  public socket: any;
  public formGroup: FormGroup;
  public messages$: Observable<any>;
  public messagesList: any = [];

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    public common: CommonService,
    private fb: FormBuilder,
    private http: HttpClient,
    public modalController: ModalController,
    private loadingService: LoadingService,
    public actionSheetController: ActionSheetController,
    private store: Store<AppState>,
    private actionsSubject$: ActionsSubject,
    // private socket: Socket,
    private photoViewer: PhotoViewer
  ) { 
    this.serverImg = this.common.photoBaseUrl+'chattings/';
    this.serverImgUser = this.common.photoBaseUrl+'users/';
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.data) {
        this.data = JSON.parse(data.data);
      }
    });
    this.messages$ = this.store.pipe(select(chatSelectors.selectMessages))
  }

  async ngOnInit() {
    this.loadingService.present();
    await this.cekLogin();
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.checkRoom();
      this.loadingService.dismiss();
    }, error => {
      this.loadingService.dismiss();
    })
  }

  checkRoom() {
    console.log(this.data)
    this.api.post('chattings/checkRooms', this.data).then(res => {
      console.log(res)
      this.checkResult(res);
    })
  }

  async replayMessage(message) {
    console.log(message)
    if(message.created_by == this.userData.id) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Pilih',
        cssClass: 'my-custom-class',
        buttons: [
        {
          text: 'Balas',
          icon: 'arrow-undo-outline',
          handler: () => {
            
          }
        },
        {
          text: 'Hapus',
          icon: 'trash-outline',
          handler: () => {
            
          }
        }
      ]
      });
      await actionSheet.present();
    } else {
      const actionSheet = await this.actionSheetController.create({
        header: 'Pilih',
        cssClass: 'my-custom-class',
        buttons: [
        {
          text: 'Balas',
          icon: 'arrow-undo-outline',
          handler: () => {
            
          }
        }
      ]
      });
      await actionSheet.present();
    }
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

      this.startWs()
  
      // load chat messages by room_id
      this.store.dispatch(chatActions.loadMessages({roomId: this.roomData.id}));
  
      this.actionsSubject$.subscribe((state: any) => {
        switch (state.type) {
          case '[Chat] Load Messages Success':
            this.messagesList = state.data;
            break;
          default:
            // pass
        }
      })
      
      // this.getChats();
      // setInterval(() => {
      //   this.getChats();
      // }, 1000)
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
    // this.listChats = [];
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

      // send to ws
      this.socket.send(JSON.stringify(dt));
  
      // send to server
      this.store.dispatch(chatActions.sendMessage({data: dt}));
  
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

  openImg(n) {
    this.photoViewer.show(n);
  }

  //notifikasi
  url_notif = 'https://fcm.googleapis.com/fcm/send';

  sendNotif() {
    let data = {
      "notification" : {
        "title": "SalamMU - Pesan Baru",
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
      "to": this.isUstad ? this.roomData.tokenUser : this.roomData.tokenUstad == null ? '':'',
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

  /**
   * Start webscoket
   */
  private startWs() {
    this.socket = new WebSocket('wss://api.sunhouse.co.id');

    // when ws open we send subscriber for listening new message
    this.socket.onopen = () => {
      console.log('ws open')

      this.socket.send(JSON.stringify({
        room: this.roomData.id,
        command: 'subscribe',
      }));
    }

    this.socket.onclose = () => {
      console.log('ws close')
    }

    // listening new message
    this.socket.onmessage = (event: any) => {
      const data = JSON.parse(event.data)

      this.messagesList = [
        ...this.messagesList,
        data.message
      ]
    }

    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.onopen(null);
    }
  }

}
