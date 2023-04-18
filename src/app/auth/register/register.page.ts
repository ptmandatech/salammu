import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;
  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private toastController: ToastController,
  ) { 
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
      address: [null, [Validators.required]],
      cabang: [null],
      ranting: [null],
      password: [null, [Validators.required, Validators.minLength(6)]],
      re_password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.getListCabang();
    this.getListRanting();
  }

  listCabang:any = [];
  listCabangTemp:any = [];
  async getListCabang() {
    try {
      await this.api.get('sicara/getAllPCM').then(res=>{ 
        this.listCabang = res;
        this.listCabangTemp = res;
      }, err => {
        this.loading = false;
      });
    } catch {

    }
  }

  listRanting:any = [];
  listRantingTemp:any = [];
  async getListRanting() {
    try {
      await this.api.get('sicara/getAllPRM').then(res=>{ 
        this.listRanting = res;
        this.listRantingTemp = res;
      }, err => {
        this.loading = false;
      });
    } catch {

    }
  }

  selectEvent(event) {
    this.form.patchValue({
      cabang: event.id
    })
  }

  selectEventRanting(event) {
    this.form.patchValue({
      ranting: event.id
    })
  }

  type = 'password';
  show() {
    this.type == 'password' ? this.type = 'text': this.type = 'password';
  }

  loading:boolean;
  register() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      this.loading=true;
      this.userData = this.form.value;
      if(this.userData.password != '' && this.userData.password == this.userData.re_password)
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
          this.toastController
          .create({
            message: 'Ada masalah. Coba lagi!',
            duration: 2000,
            color: "danger",
          })
          .then((toastEl) => {
            toastEl.present();
          });
        })
      }else{
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
