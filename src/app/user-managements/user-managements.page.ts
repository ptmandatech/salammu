import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-user-managements',
  templateUrl: './user-managements.page.html',
  styleUrls: ['./user-managements.page.scss'],
})
export class UserManagementsPage implements OnInit {

  listUsers:any = [];
  listUsersTemp:any = [];
  serverImg:any;
  loading:boolean;
  userData:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    private toastController: ToastController,
    public router:Router,
  ) { }

  ngOnInit() {
    this.loading = true;
  }

  ionViewWillEnter() {
    this.listUsers = [];
    this.listUsersTemp = [];
    this.cekLogin();
    this.serverImg = this.common.photoBaseUrl+'users/';
  }

  async doRefresh(event) {
    this.loading = true;
    this.listUsers = [];
    this.listUsersTemp = [];
    this.cekLogin();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.getAllUsers();
    }, error => {
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.router.navigate(['/home']);
      console.log(error)
    })
  }

  getAllUsers() {
    this.api.get('users/'+this.userData.id).then(res => {
      this.listUsers = res;
      this.listUsersTemp = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  initializeItems(): void {
    this.listUsers = this.listUsersTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listUsers = this.listUsers.filter(video => {
      if (video.title && searchTerm) {
        if (video.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  update(n) {
    this.router.navigate(['/user-managements/tambah-user', n.id])
  }

  delete(n) {
    if(n.id == this.userData.id) {
      this.toastController
      .create({
        message: 'Tidak dapat menghapus akun!',
        duration: 2000,
        color: "danger",
      })
      .then((toastEl) => {
        toastEl.present();
      });
    } else {
      var conf = confirm('Anda yakin ingin menghapus pengguna?');
      if (conf) {
        this.api.delete('users/'+n.id).then(res => {
          if(res) {
            this.toastController
            .create({
              message: 'Berhasil menghapus data pengguna.',
              duration: 2000,
              color: "primary",
            })
            .then((toastEl) => {
              toastEl.present();
            });
            this.getAllUsers();
          }
        })
      }
    }
  }


}
