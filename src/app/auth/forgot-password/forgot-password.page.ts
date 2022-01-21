import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private router: Router,
    private api: ApiService,
    private toastController: ToastController,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }
  
  user:any = {};
  submited:boolean;
  loading:boolean;
  error:any;
  send() {
    this.submited = true;
    var email = this.user.email == undefined ? '':this.user.email.toLowerCase();
    this.loading=true;
    this.api.post('auth/reset',{email:email}).then(res=>{
      this.toastController
      .create({
        message: 'Tautan pembaharuan password berhasil dikirim.',
        duration: 2000,
        color: "primary",
      })
      .then((toastEl) => {
        toastEl.present();
      });
      this.loading=false;
      this.submited = false;
      localStorage.removeItem('salammuToken');
      this.dismiss();
    },err=>{
      this.error = err;
      this.loading=false;
      var that = this;
      setTimeout(function () {
        that.submited = false;
        that.error = undefined;
      }, 2000);
    });
  }

  async dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
