import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  form: FormGroup;
  user:any = {};
  userData:any;
  constructor(
    public api: ApiService,
    public router:Router,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) { 
    this.form = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      password2: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

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
  submited:boolean;
  checkMatch() {
    this.user.password2 == this.user.password ? this.match = true:this.match = false;
  }

  changePassword() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      this.loading = true;
      this.submited = true;
      this.user = this.form.value;
      if(this.user.password != '' && this.user.password == this.user.password2)
      {
        this.user.email = this.userData.email;
        this.api.put('users/changePass/'+this.userData.id, this.user).then(async res => {
          if(res) {
            this.submited = false;
            this.toastController
            .create({
              message: 'Berhasil memperbarui Kata Sandi.',
              duration: 2000,
              color: "primary",
            })
            .then((toastEl) => {
              toastEl.present();
            });
            this.loading = false;
            localStorage.removeItem('userSalammu');
            localStorage.removeItem('salammuToken');
            this.login(this.user);
          }
        }, error => {
          this.loading = false;
          this.submited = false;
        })
      } else {
        this.loading=false;
        this.submited = false;
        this.toastController
        .create({
          message: 'Kata Sandi tidak cocok.',
          duration: 2000,
          color: "danger",
        })
        .then((toastEl) => {
          toastEl.present();
        });
      }
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

  async login(userData) {
    var dt = {
      email: userData.email,
      password: userData.password
    }
    await this.api.post('auth/login',dt).then(res=>{     
      localStorage.setItem('salammuToken',JSON.stringify(res));
      this.router.navigate(['/home']);
      this.loading=false;
    }).catch(error => {
      this.loading=false;
    });
  }

}
