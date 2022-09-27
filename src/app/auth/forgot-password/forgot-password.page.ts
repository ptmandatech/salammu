import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form: FormGroup;
  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    public modalController: ModalController,
  ) { 
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }
  
  user:any = {};
  submited:boolean;
  loading:boolean;
  error:any;
  send() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      this.submited = true;
      this.user = this.form.value;
      var email = this.user.email == undefined ? '':this.user.email.toLowerCase();
      this.loading=true;
      this.api.post('auth/reset',{email:email}).then(res=>{
        this.toastController
        .create({
          message: 'Tautan pembaharuan kata sandi berhasil dikirim.',
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
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  async dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
