import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { LoginPage } from '../auth/login/login.page';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-tanya-ustad',
  templateUrl: './tanya-ustad.page.html',
  styleUrls: ['./tanya-ustad.page.scss'],
})
export class TanyaUstadPage implements OnInit {

  defaultSegment:any='list';
  listUstadz:any = [];
  listRoomChats:any = [];
  listRoomChatsTemp:any = [];
  listUstadzTemp:any = [];
  serverImg: any;
  loading:boolean;
  userData:any;
  unreadTotal = 0;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.present();
    this.serverImg = this.common.photoBaseUrl+'pediamu/';
    this.listUstadz = [];
    this.listUstadzTemp = [];
    this.getAllUstadz();
    this.cekLogin();
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listUstadz = [];
    this.listUstadzTemp = [];
    this.present();
    this.getAllUstadz();
    this.cekLogin();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
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
      this.getAvailableRoomChats();
      this.loadingController.dismiss();
    }, error => {
      console.log(error)
      this.loadingController.dismiss();
    })
  }

  getAllUstadz() {
    this.listUstadz = [];
    this.listUstadzTemp = [];
    this.api.get('ustadzmu').then(res => {
      this.listUstadz = res;
      this.listUstadzTemp = res;
    }, error => {
      this.loading = false;
    })
  }

  newMessage(n, status) {
    if(this.userData) {
      let dt;
      if(status == 'new') {
        dt = {
          ustadz_id: n.id,
          ustadz_name: n.name,
          user_id: this.userData.id,
        }
      } else {
        dt = {
          ustadz_id: n.ustadz_id,
          ustadz_name: n.ustadz_name,
          user_id: this.userData.id,
        }
      }
      const param: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(dt)
        }
      }
      this.router.navigate(['/tanya-ustad/chatting'], param);
    } else {
      this.toastController
      .create({
        message: 'Anda harus login terlebih dahulu.',
        duration: 2000,
        color: "danger",
      })
      .then((toastEl) => {
        toastEl.present();
      });
      this.modalLogin();
    }
  }

  getAvailableRoomChats() {
    this.unreadTotal = 0;
    this.listRoomChats = [];
    this.listRoomChatsTemp = [];
    this.api.get('chattings/getRooms/'+this.userData.id).then(res => {
      this.listRoomChats = res;
      this.listRoomChatsTemp = res;
      this.listRoomChats.forEach(data => {
        if(data.user_already_read == '0') {
          this.unreadTotal += 1;
        }
      });
    })
  }

  async modalLogin() {
    await this.cekLogin();
    let userData = JSON.parse(localStorage.getItem('salammuToken'));
    if(userData == undefined) {
      const modal = await this.modalController.create({
        component: LoginPage,
        mode: "md",
      });
      modal.onDidDismiss().then(async res => {
        this.userData = undefined;
        this.cekLogin();
      })
      return await modal.present();
    }
  }

  initializeItems(): void {
    if(this.defaultSegment == 'list') {
      this.listUstadz = this.listUstadzTemp;
    } else {
      this.listRoomChats = this.listRoomChatsTemp;
    }
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    if(this.defaultSegment == 'list') {
      this.listUstadz = this.listUstadz.filter(ustadz => {
        if (ustadz.name && searchTerm) {
          if (ustadz.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          if (ustadz.science_name && searchTerm) {
            if (ustadz.science_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
          return false;
        }
      });
    } else {
      this.listRoomChats = this.listRoomChats.filter(rooms => {
        if (rooms.ustadz_name && searchTerm) {
          if (rooms.ustadz_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          if (rooms.lastMessages && searchTerm) {
            if (rooms.lastMessages.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
          return false;
        }
      });
    }
  }

}