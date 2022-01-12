import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
        alert('Pendaftaran berhasil.');
        this.login();
        this.loading=false;
      },err=>{
        this.loading=false;
        alert('Ada masalah. Coba lagi!');
      })
    }else{
      alert('Password tidak cocok');
    }
  }

  login() {
    var dt = {
      email: this.userData.email,
      password: this.userData.password
    }
    this.api.post('auth/login',dt).then(res=>{     
      this.loading=false;
      localStorage.setItem('salammuToken',JSON.stringify(res));
      this.router.navigate(['/home']);
    });
  }

  match!:boolean;
  checkMatch() {
    this.userData.p2 == this.userData.password ? this.match = true:this.match = false;
  }

  async dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}