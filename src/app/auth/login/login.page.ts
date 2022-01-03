import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public router: Router,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  type = 'password';
  show() {
    this.type == 'password' ? this.type = 'text': this.type = 'password';
  }


  login() {
    this.dismiss();
    this.router.navigate(['/profil'])
  }

  async dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async modalRegister() {
    const modal = await this.modalController.create({
      component: RegisterPage,
      mode: "md",
    });
    this.dismiss();
    return await modal.present();
  }

  async modalForgot() {
    const modal = await this.modalController.create({
      component: ForgotPasswordPage,
      mode: "md",
    });
    this.dismiss();
    return await modal.present();
  }

}
