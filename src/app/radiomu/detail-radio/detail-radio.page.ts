import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-detail-radio',
  templateUrl: './detail-radio.page.html',
  styleUrls: ['./detail-radio.page.scss'],
})
export class DetailRadioPage implements OnInit {

  radiomuData:any = {};
  id:any;
  isCreated:boolean = true;
  loading:boolean;
  serverImg:any;
  userData:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingController: LoadingController,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.cekLogin();
    this.serverImg = this.common.photoBaseUrl+'radiomu/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailRadiomu();
    }
  }

  async present() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      duration: 10000,
      message: 'Tunggu Sebentar...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
          this.loading = false;
        }
      });
      this.loading = false;
    });
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    }, error => {
      console.log(error);
    })
  }

  getDetailRadiomu() {
    this.api.get('radiomu/find/'+this.id).then(res => {
      this.radiomuData = res;
      console.log(res)
    })
  } 

}
