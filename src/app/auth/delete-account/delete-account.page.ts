import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {

  form: FormGroup;
  userData:any;
  constructor(
    private loadingController: LoadingController,
    public router: Router,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private api: ApiService
  ) { 
    this.form = this.formBuilder.group({
      confirmCode: [null, [Validators.required]]
    });
  }

  uniqueCode:any = '';
  ngOnInit() {
    this.generateUniqueCodes(1);
    this.loginStatus();
  }

  loading:boolean;
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

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.loadingController.dismiss();
    }, error => {
      console.log(error)
      this.loadingController.dismiss();
    })
  }

  sendDeleteAccount() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      if(this.form.get('confirmCode').value == this.uniqueCode) {
        swal({
          title: "Anda yakin ingin melakukan penghapusan akun ini?",
          icon: "warning",
          buttons: ['Batal', 'Lanjutkan'],
          dangerMode: false,
        })
        .then((next) => {
          console.log(next);
          if (next) {
            this.loading = true;
            this.updateStatusAccToDeleted();
          } else {
            console.log('Confirm Batal: blah');
          }
        });
      } else {
        this.toastController
        .create({
          message: 'Kode Konfirmasi Salah!',
          duration: 2000,
          color: "danger",
        })
        .then((toastEl) => {
          toastEl.present();
        });
        this.generateUniqueCodes(1);
      }
    }
  }

  updateStatusAccToDeleted() {
    this.userData.isDeleted = 1;
    this.userData.is_active = 0;

    this.api.put('users/'+this.userData.id, this.userData).then(res=>{
      this.toastController
      .create({
        message: 'Berhasil melakukan penghapusan akun.',
        duration: 2000,
        color: "primary",
      })
      .then((toastEl) => {
        toastEl.present();
      });
      this.loading = false;
      localStorage.removeItem('userSalammu');
      localStorage.removeItem('salammuToken');
      this.router.navigate(['/home']);
    }, error => {
      console.log(error)
    });
  }

  generateUniqueCodes(count: number): string[] {
    const uniqueCodes: string[] = [];
  
    for (let i = 0; i < count; i++) {
      const code = this.generateSingleUniqueCode();
      uniqueCodes.push(code);
    }
    this.uniqueCode = uniqueCodes;
    return uniqueCodes;
  }
  
  generateSingleUniqueCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 5;
    let code = '';
  
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
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

}
