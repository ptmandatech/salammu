import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  user:any = {};
  submited:boolean;
  loading:boolean;
  constructor(
    public routes: ActivatedRoute,
    private router: Router,
    private api:ApiService,
    private navCtrl: NavController
  ) { }

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
      alert('Token tidak valid!');
      this.router.navigate(['/home']);
    })
  }

  reset() {
    this.submited = true;
    var email = this.userData.email == null ? this.userData.username:this.userData.email;
    this.loading=true;
    this.api.put('auth/reset',{password:this.user.password, email:email}).then(res=>{
      alert('Pembaruan password berhasil');
      this.loading=false;
      this.submited = false;
      localStorage.removeItem('salammuToken');
      this.navCtrl.navigateRoot(['/home']);
    },err=>{
      alert('Tidak dapat memperbarui password');
      this.loading=false;
      var that = this;
      setTimeout(function () {
        that.submited = false;
      }, 1000);
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
