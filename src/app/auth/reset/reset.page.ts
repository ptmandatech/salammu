import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  form: FormGroup;
  user:any = {};
  submited:boolean;
  loading:boolean;
  constructor(
    public routes: ActivatedRoute,
    private router: Router,
    private api:ApiService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
  ) {
    this.form = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      re_password: [null, [Validators.required, Validators.minLength(6)]]
    });
   }

  ngOnInit() {
    var token=this.routes.snapshot.paramMap.get('token');
    this.checkToken(token);
  }

  userData:any;
  checkToken(token)
  {    
    this.api.get('auth/reset?token='+token).then(res=>{
      this.userData=res;
    },err=>{
      this.toastController
      .create({
        message: 'Token tidak valid!',
        duration: 2000,
        color: "danger",
      })
      .then((toastEl) => {
        toastEl.present();
      });
      this.router.navigate(['/home']);
    })
  }

  reset() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      this.submited = true;
      this.user = this.form.value;
      if(this.user.password != '' && this.user.password == this.user.re_password)
      {
        var email = this.userData.email == null ? this.userData.username:this.userData.email;
        this.loading=true;
        this.api.put('auth/reset',{password:this.user.password, email:email}).then(res=>{
          this.toastController
          .create({
            message: 'Kata sandi berhasil diperbarui, silahkan buka aplikasi salammu dengan password baru anda.',
            duration: 2000,
            color: "primary",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading=false;
          this.submited = false;
          localStorage.removeItem('salammuToken');
          // this.navCtrl.navigateRoot(['/home']);
        },err=>{
          this.toastController
          .create({
            message: 'Tidak dapat memperbarui Kata Sandi',
            duration: 2000,
            color: "danger",
          })
          .then((toastEl) => {
            toastEl.present();
          });
          this.loading=false;
          var that = this;
          setTimeout(function () {
            that.submited = false;
          }, 1000);
        });
      } else {
        this.loading=false;
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

  type = 'password';
  show() {
    this.type == 'password' ? this.type = 'text': this.type = 'password';
  }

  match:boolean;
  checkMatch() {
    this.user.password2 == this.user.password ? this.match = true:this.match = false;
  }
}
