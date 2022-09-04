import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, IonContent, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  userData:any;

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private http: HttpClient,
    private loadingController: LoadingController,
    public actionSheetController: ActionSheetController
  ) { 
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
    this.api.post('chattings/checkRooms', this.data).then(res => {
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
      if(this.roomData.ustadz_id == this.userData.id) {
        this.isUstad = true;
      } else {
        this.isUstad = false;
      }
      this.getChats();
    }

    if(this.newMsg != '') {
      this.sendMessage();
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
  
      setTimeout(() => {
        this.content.scrollToBottom(400);
      }, 1000);
    })
  }

  sendMessage() {
    if(this.roomExist) {
      let dt = {
        id: new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))],
        created_by: this.userData.id,
        room_id: this.roomData.id,
        messages: this.newMsg,
        ustad_already_read: this.roomData.ustadz_id == this.userData.id ? true:false,
        user_already_read: this.roomData.ustadz_id != this.userData.id ? true:false,
        type: this.image == null ? 'text':'image'
      }
  
      this.newMsg = '';
  
      this.api.post('chattings/chats', dt).then(res => {
        console.log(res)
        this.sendNotif();
        this.getChats();
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
          console.log('Foto');
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log('Album');
        }
      }]
    });
    await actionSheet.present();
  }

  //notifikasi
  url_notif = 'https://fcm.googleapis.com/fcm/send';

  sendNotif() {
    let data = {
      "notification" : {
        "title":"E-Office - Disposisi Surat",
        "body":"Disposisi surat ditambahkan, cek sekarang!",
        "sound":"default",
        "icon":"app-logo"
      },
      "data": {
        "room_id":this.roomData.id,
      },
      "to": this.isUstad ? this.roomData.tokenUser : this.roomData.tokenUstad,
      "priority":"high",
      "restricted_package_name":""
    };

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `key=AAAAG0kJgqs:APA91bHeYFmnOQgHTvtUE1Xm0uaLmIvaIuCg1EozVdGltZKm46Kd_aocWQPN37-reVz5-nSjoDY1aMGlA-VXs9bPZCgtLBgy-k77wsyuUsHhH0g3lmfX-n69bT-r95xeBF3hqBlYZ-FS`
    });

    this.http.post(this.url_notif, data, { headers }).subscribe( res => {
    });
  }

}
