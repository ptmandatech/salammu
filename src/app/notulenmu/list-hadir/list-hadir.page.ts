import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { TambahPesertaPage } from '../tambah-peserta/tambah-peserta.page';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-list-hadir',
  templateUrl: './list-hadir.page.html',
  styleUrls: ['./list-hadir.page.scss'],
})
export class ListHadirPage implements OnInit {

  listUsers:any = [];
  listUsersTemp:any = [];
  serverImg: any;
  loading:boolean;
  dataLogin:any = {};
  id:any;
  action:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private toastController: ToastController,
    public routes:ActivatedRoute,
    private loadingService: LoadingService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.id = this.navParams.get('id');
    this.action = this.navParams.get('action');
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.cekLogin();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'users/';
    this.listUsers = [];
    this.listUsersTemp = [];
    this.getAllUsers();
    this.getDetailNotulen();
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  userData:any;
  isLoggedIn:boolean = false;
  cekLogin()
  {
    this.api.me().then(async res=>{
      this.userData = res;
      this.isLoggedIn = true;
      this.loadingService.dismiss();
    }, async error => {
      this.isLoggedIn = false;
      this.loadingService.dismiss();
    })
  }

  async doRefresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllUsers() {
    if(this.dataLogin) {
      if(this.dataLogin.role == 'superadmin') {
        this.api.get('users/getAllAdmin').then(res => {
          this.listUsers = res;
          this.listUsersTemp = res;
          this.parseData();
        }, error => {
          this.loading = false;
          this.loadingService.dismiss();
        })
      } else {
        this.api.get('users/getAll?cabang='+this.dataLogin.cabang_id+'&ranting='+this.dataLogin.ranting_id).then(res => {
          this.listUsers = res;
          this.listUsersTemp = res;
          this.parseData();
        }, error => {
          this.loading = false;
          this.loadingService.dismiss();
        })
      }
    }
  }
  
  parseData() {
    if(this.notulenData.notulenmu_participants) {
      for(var i=0; i<this.notulenData.notulenmu_participants.length; i++) {
        let p = this.notulenData.notulenmu_participants[i];
        for(var j=0; j<this.listUsers.length; j++) {
          let u = this.listUsers[j];
          if(p.user_id == u.id) {
            this.listUsers[j].checked = true;
          }
        }
        let idx = this.listUsers.findIndex(v => v.id == p.user_id);
        if(idx == -1) {
          p.checked = true;
          p.name = p.user_name;
          this.listUsers.push(p);
        }
      }
    }
    this.loading = false;
    this.loadingService.dismiss();
  }

  initializeItems(): void {
    this.listUsers = this.listUsersTemp;
    this,this.notulenData.notulenmu_participants = this.notulenData.notulenmu_participantsTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listUsers = this.listUsers.filter(data => {
      if (data.name && searchTerm) {
        if (data.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    this.notulenData.notulenmu_participants = this.notulenData.notulenmu_participants.filter(data => {
      if (data.user_name && searchTerm) {
        if (data.user_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  notulenData:any = {};
  getDetailNotulen() {
    this.api.get('notulenmu/find/'+this.id).then(res => {
      this.notulenData = res;
      this.notulenData.notulenmu_participantsTemp = this.notulenData.notulenmu_participants;
      this.loading = false;
      this.loadingService.dismiss();
    }, err => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  async tambahPeserta() {
    const modal = await this.modalController.create({
      component: TambahPesertaPage,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.99,
      breakpoints: [0, 0.99, 1]
    });

    modal.onDidDismiss().then(async (result) => {
      if(result.data) {
        this.listUsers.push(result.data);
      }
    });
    return await modal.present();
  }

  async simpanPartisipan() {
    let data = this.listUsers.filter(user => user.checked === true);
    let result = [];
    for(var i = 0; i < data.length; i++) {
      let dt = {
        id: new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))],
        user_id: data[i].id,
        user_name: data[i].name,
        user_image: data[i].image,
        user_email: data[i].email,
        notulenmu_id: this.id,
      }
      result.push(dt);
    }
    
    this.api.post('notulenmu/participants', result).then(res => {
      if(res) {
        this.toastController
        .create({
          message: 'Berhasil menambahkan data peserta.',
          duration: 2000,
          color: "primary",
        })
        .then((toastEl) => {
          toastEl.present();
        });
        this.loading = false;
        this.modalController.dismiss(result);
      }
    }, err => {
      this.loading = false;
    })
  }

  close() {
    this.modalController.dismiss();
  }

}
