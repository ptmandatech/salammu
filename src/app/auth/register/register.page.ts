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
      wilayah: [null],
      daerah: [null],
      cabang: [null],
      ranting: [null],
      password: [null, [Validators.required, Validators.minLength(6)]],
      re_password: [null, [Validators.required, Validators.minLength(6)]],
      asManagement: [false],
      placeManagement: [null]
    });
  }

  ngOnInit() {
    this.getListWilayah();
    this.getListDaerah();
    this.getListCabang();
    this.getListRanting();
  }

  listWilayah:any = [];
  listWilayahTemp:any = [];
  gettingWilayah:boolean = true;
  async getListWilayah() {
    this.gettingWilayah = true;
    try {
      await this.api.get('sicara/getAllPWM').then(res=>{ 
        this.listWilayah = res;
        this.listWilayahTemp = res;
        this.gettingWilayah = false;
      }, err => {
        this.loading = false;
        this.gettingWilayah = false;
      });
    } catch {

    }
  }

  listDaerah:any = [];
  listDaerahTemp:any = [];
  gettingDaerah:boolean = true;
  async getListDaerah() {
    this.gettingDaerah = true;
    try {
      await this.api.get('sicara/getAllPDM').then(res=>{ 
        this.listDaerah = res;
        this.listDaerahTemp = res;
        this.gettingDaerah = false;
      }, err => {
        this.loading = false;
        this.gettingDaerah = false;
      });
    } catch {

    }
  }

  listCabang:any = [];
  listCabangTemp:any = [];
  gettingCabang:boolean = true;
  async getListCabang() {
    this.gettingCabang = true;
    try {
      await this.api.get('sicara/getAllPCM').then(res=>{ 
        this.listCabang = res;
        this.listCabangTemp = res;
        this.gettingCabang = false;
      }, err => {
        this.loading = false;
        this.gettingCabang = false;
      });
    } catch {

    }
  }

  listRanting:any = [];
  listRantingTemp:any = [];
  gettingRanting:boolean = true;
  async getListRanting() {
    this.gettingRanting = true;
    this.form.patchValue({
      ranting: null
    })
    try {
      if(this.form.get('cabang').value) {
        let val = this.form.get('cabang').value;
        await this.api.get('sicara/getAllPRM?pcm_id='+val).then(res=>{ 
          this.listRanting = res;
          this.listRantingTemp = res;
          this.gettingRanting = false;
        }, err => {
          this.loading = false;
          this.gettingRanting = false;
        });
      } else {
        await this.api.get('sicara/getAllPRM').then(res=>{ 
          this.listRanting = res;
          this.listRantingTemp = res;
          this.gettingRanting = false;
        }, err => {
          this.loading = false;
          this.gettingRanting = false;
        });
      }
    } catch {

    }
  }

  async selectEventPWM(val) {
    this.form.patchValue({
      wilayah: val
    })
    this.listDaerah = [];
    this.listDaerahTemp = [];
    this.gettingDaerah = true;
    this.form.patchValue({
      daerah: null,
      cabang: null,
      ranting: null
    })
    this.form.get('cabang').disable();
    this.form.get('ranting').disable();
    await this.api.get('sicara/getAllPDM?pwm_id='+val).then(res=>{ 
      this.listDaerah = res;
      this.listDaerahTemp = res;
      this.gettingDaerah = false;
    }, err => {
      this.loading = false;
      this.gettingDaerah = false;
    });
  }

  async selectEventPDM(val) {
    this.form.patchValue({
      daerah: val
    })
    this.listCabang = [];
    this.listCabangTemp = [];
    this.gettingCabang = true;
    this.form.patchValue({
      cabang: null,
      ranting: null
    })
    this.form.get('cabang').enable();
    this.form.get('ranting').disable();
    await this.api.get('sicara/getAllPCM?pdm_id='+val).then(res=>{ 
      this.listCabang = res;
      this.listCabangTemp = res;
      this.gettingCabang = false;
    }, err => {
      this.loading = false;
      this.gettingCabang = false;
    });
  }

  async selectEvent(val) {
    this.form.patchValue({
      cabang: val
    })
    this.listRanting = [];
    this.listRantingTemp = [];
    this.gettingRanting = true;
    this.form.patchValue({
      ranting: null
    })
    this.form.get('ranting').enable();
    await this.api.get('sicara/getAllPRM?pcm_id='+val).then(res=>{ 
      this.listRanting = res;
      this.listRantingTemp = res;
      this.gettingRanting = false;
    }, err => {
      this.loading = false;
      this.gettingRanting = false;
    });
  }

  selectEventRanting(val) {
    this.form.patchValue({
      ranting: val
    })
  }

  pengurus:any = [
    {
      id:'wilayah',
      nama: 'Wilayah',
      disabled: true
    },
    {
      id:'daerah',
      nama: 'Daerah',
      disabled: true
    }
  ]
  
  checkLPCRM(evt) {
    if(this.form.get('wilayah').value) {
      let idx = this.pengurus.findIndex(e => e.id == 'wilayah');
      if(idx != -1) {
        this.pengurus[idx].disabled = false;
      }
    }

    if(this.form.get('daerah').value) {
      let idx = this.pengurus.findIndex(e => e.id == 'daerah');
      if(idx != -1) {
        this.pengurus[idx].disabled = false;
      }
    }

    if(this.form.get('wilayah').value || this.form.get('daerah').value) {
      // this.form.patchValue({
      //   asManagement: true
      // });
    } else {
      this.toastController
      .create({
        message: 'Pilih Wilayah atau Daerah.',
        duration: 2000,
        color: "danger",
      })
      .then((toastEl) => {
        toastEl.present();
      });
      this.userData.asManagement = '0';
      this.userData.statusAsManagement = 'isNotManagement';
      this.form.patchValue({
        asManagement: false
      });
    }
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
      if(this.userData.asManagement) {
        this.userData.statusAsManagement = 'pending';
      } else {
        this.userData.statusAsManagement = 'isNotManagement';
      }
      if(this.userData.password != '' && this.userData.password == this.userData.re_password)
      {
        this.userData.is_active = 1;
        this.userData.date_created = new Date();
        this.userData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
        this.userData.role = 'user';
        this.api.post('auth/register/',this.userData).then((res:any)=>{
          if(res != 'exist') {
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
          } else {
            this.loading=false;
            this.toastController
            .create({
              message: 'Email sudah digunakan!',
              duration: 2000,
              color: "danger",
            })
            .then((toastEl) => {
              toastEl.present();
            });
          }
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
      email: userData.email == null ? userData.phone:userData.email,
      password: userData.password
    }
    await this.api.post('auth/login',dt).then(res=>{     
      localStorage.setItem('salammuToken',JSON.stringify(res));
      var that = this;
      this.dismiss();
      this.dismiss();
      setTimeout(function () {
        that.dismiss();
        this.router.navigate(['/home']);
      }, 1000);
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
