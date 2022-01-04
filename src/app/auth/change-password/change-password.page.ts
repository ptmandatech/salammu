import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  user:any = {};
  userData:any;
  constructor(
    public api: ApiService,
    public router:Router,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.cekLogin();
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.loadingController.dismiss();
    }, error => {
      this.loadingController.dismiss();
    })
  }

  type = 'password';
  show() {
    this.type == 'password' ? this.type = 'text': this.type = 'password';
  }

  match:boolean;
  loading:boolean;
  checkMatch() {
    this.user.password2 == this.user.password ? this.match = true:this.match = false;
  }

  changePassword() {
    this.user.email = this.userData.email;
    this.loading = true;
    this.api.put('users/changePass/'+this.userData.id, this.user).then(async res => {
      if(res) {
        alert('Berhasil memperbarui password.');
        this.loading = false;
        localStorage.removeItem('userSalammu');
        localStorage.removeItem('salammuToken');
        const modal = await this.modalController.create({
          component: LoginPage,
          mode: "md",
        });
        return await modal.present();
      }
    }, error => {
      console.log(error);
      this.loading = false;
    })
  }

}
