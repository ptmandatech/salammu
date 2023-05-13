import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { LoginPage } from '../auth/login/login.page';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';

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
  serverImgUser: any;
  loading:boolean;
  userData:any;
  unreadTotal = 0;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private toastController: ToastController,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingService.present();
    this.serverImg = this.common.photoBaseUrl+'pediamu/';
    this.serverImgUser = this.common.photoBaseUrl+'users/';
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
    this.loadingService.present();
    this.getAllUstadz();
    this.cekLogin();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      console.log(res)
      this.getAvailableRoomChats();
      this.loadingService.dismiss();
    }, error => {
      this.loadingService.dismiss();
    })
  }

  getAllUstadz() {
    this.listUstadz = [];
    this.listUstadzTemp = [];
    this.api.get('ustadzmu').then(res => {
      this.listUstadz = res;
      this.listUstadzTemp = res;
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  newMessage(n, status) {
    console.log(n)
    if(this.userData) {
      let dt;
      if(status == 'new') {
        dt = {
          status: status,
          ustadz_id: n.id,
          ustadz_name: n.name,
          ustadz_image: n.user_image,
          user_id: this.userData.id,
          user_name: this.userData.name,
          user_image: this.userData.image,
        }
      } else {
        if(this.userData.role != 'superadmin') {
          if(this.userData.id == n.ustadz_id) {
            dt = {
              status: 'old',
              ustadz_id: this.userData.id,
              ustadz_name: this.userData.name,
              ustadz_image: this.userData.image,
              user_id: n.user_id,
              user_name: n.name,
              user_image: n.user_image,
            }
          } else {
            dt = {
              status: 'old',
              ustadz_id: n.ustadz_id,
              ustadz_name: n.ustadz_name,
              ustadz_image: n.ustadz_image,
              user_id: this.userData.id,
              user_name: this.userData.name,
              user_image: this.userData.image,
            }
          }
        } else {
          n.status = 'old';
          dt = n;
        }
      }
      if(n.id != this.userData.id){
        const param: NavigationExtras = {
          queryParams: {
            data: JSON.stringify(dt)
          }
        }
        this.router.navigate(['/tanya-ustad/chatting'], param);
      } else {
        this.toastController
        .create({
          message: 'Tidak dapat mengirim pesan kepada anda sendiri.',
          duration: 2000,
          color: "danger",
        })
        .then((toastEl) => {
          toastEl.present();
        });
      }
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
    this.loadingService.present();
    this.api.get('chattings/getRooms/'+this.userData.id).then(res => {
      this.listRoomChats = res;
      this.listRoomChatsTemp = res;
      this.listRoomChats.forEach(data => {
        if(this.userData.role == 'ustadz') {
          if(data.ustad_already_read == '0') {
            this.unreadTotal += 1;
          }
        } else {
          if(data.user_already_read == '0') {
            this.unreadTotal += 1;
          }
        }
      });
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();
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
        if(this.userData.role == 'ustadz') {
          if (rooms.user_name && searchTerm) {
            if (rooms.user_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
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
        } else {
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
        }
      });
    }
  }

}
