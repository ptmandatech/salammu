import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
import { RegisterPage } from '../register/register.page';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public api: ApiService,
    public router:Router,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit(): void {
    this.cekLogin();
  }

  ionViewWillEnter() {
    this.loginStatus();
  }

  async loginStatus() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      message: 'Mohon Tunggu...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        this.cekLogin();
      });
      this.loading = false;
    });
  }

  type = 'password';
  show() {
    this.type == 'password' ? this.type = 'text': this.type = 'password';
  }

  user:any={
    email:'',
    password:''
  }

  loading:boolean;
  submited:boolean;
  invalid:boolean = false;
  login(email, password)
  {
    this.submited = true;
    this.loading=true;
    this.user.email = this.user.email.toLowerCase();
    if(this.user.remember == true) {
      localStorage.setItem('userSalammu', JSON.stringify(this.user));
    }
    if(email.invalid == false && password.invalid == false) {
      this.api.post('auth/login',this.user).then(res=>{     
        this.loading=false;
        this.submited = false;
        localStorage.setItem('salammuToken',JSON.stringify(res));
        this.redirect(res);
      },err=>{
        var that = this;
        this.loading=false;
        this.submited = false;
        if(err.error.status == 'invalid') {
          this.invalid = true;
        } else if(err.error.status == 'not_match') {
          this.invalid = true;
        }
        setTimeout(function () {
          that.invalid = false;
        }, 1000);
      })
    } else {
      var that = this;
      setTimeout(function () {
        that.submited = false;
        that.loading = false;
      }, 500);
    }
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.redirect(res);
    }, error => {
      this.loadingController.dismiss();
    })
  }

  nonaktif:boolean = false;
  redirect(user)
  {
    if(user.is_active == 1) {
      this.cekToken(user, user.email);
      var that = this;
      setTimeout(function () {
        that.dismiss();
        that.router.navigate(['/profil']);
      }, 1000);
    } else {
      this.dismiss();
      this.nonaktif = true;
      setTimeout(function () {
        location.reload();
      }, 1000);
    }
    this.loadingController.dismiss();
  }

  async dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    }).catch(error => {
      this.router.navigate(['/home']);
    });
  }

  async modalRegister() {
    const modal = await this.modalController.create({
      component: RegisterPage,
      mode: "md",
    });

    modal.onDidDismiss().then(res => {
      this.dismiss();
      this.router.navigate(['/profil']);
    })
    return await modal.present();
  }

  async modalForgot() {
    const modal = await this.modalController.create({
      component: ForgotPasswordPage,
      mode: "md",
    });
    modal.onDidDismiss().then(res => {
      this.dismiss();
      this.router.navigate(['/profil']);
    })
    return await modal.present();
  }

  cekToken(user, email) {
    PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        this.saveToken(user, token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        swal({
          title: "Error on registration",
          text: JSON.stringify(error),
          icon: "error",
          timer: 3000,
        });
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        const data = notification.data;
        swal({
          title: notification.title,
          text: notification.body,
          icon: "info",
          buttons: ['Tutup', 'Buka'],
          dangerMode: false,
        })
        .then((open) => {
          if (open) {
            // if(data.id_surat != undefined) {
            //   this.lihatSurat(data);
            // }
          } else {
            console.log('Confirm Batal: blah');
          }
        });
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        const notif = notification.notification;
        const data = notification.notification.data;
        swal({
          title: notif.title,
          text: notif.body,
          icon: "info",
          buttons: ['Tutup', 'Buka'],
          dangerMode: false,
        })
        .then((open) => {
          if (open) {
            // if(data.id_surat != undefined) {
            //   this.lihatSurat(data);
            // }
          } else {
            console.log('Confirm Batal: blah');
          }
        });
      }
    );
  }

  saveToken(user, token) {
    this.api.put('users/'+user.id, { tokenFCM: token }).then(res => {
      console.log(res)
    })
  }

}
