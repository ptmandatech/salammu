import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  userData:any = {};
  constructor(
    private router: Router,
    private api: ApiService,
    public modalController: ModalController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  type = 'password';
  show() {
    this.type == 'password' ? this.type = 'text': this.type = 'password';
  }

  loading:boolean;
  register() {
    this.loading=true;
    if(this.userData.password != '' && this.userData.password == this.userData.p2)
    {
      this.userData.is_active = 1;
      this.userData.date_created = new Date();
      this.userData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      this.userData.role = 'user';
      this.api.post('auth/register/',this.userData).then(res=>{
        this.toastController
        .create({
          message: 'Pendaftaran berhasil.',
          duration: 2000,
          color: "primary",
        })
        .then((toastEl) => {
          toastEl.present();
        });
        this.login(this.userData);
      },err=>{
        this.loading=false;
        alert('Ada masalah. Coba lagi!');
      })
    }else{
      alert('Password tidak cocok');
    }
  }

  async login(userData) {
    var dt = {
      email: userData.email,
      password: userData.password
    }
    await this.api.post('auth/login',dt).then(res=>{     
      localStorage.setItem('salammuToken',JSON.stringify(res));
      this.dismiss();
      this.router.navigate(['/home']);
      this.loading=false;
    }).catch(error => {
      this.loading=false;
    });
  }

  match:boolean;
  checkMatch() {
    this.userData.p2 == this.userData.password ? this.match = true:this.match = false;
  }

  async dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
