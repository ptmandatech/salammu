import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

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
    private loadingService: LoadingService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.cekLogin();
    this.serverImg = this.common.photoBaseUrl+'radiomu/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailRadiomu();
    }
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.loadingService.dismiss();
    }, error => {
      console.log(error);
      this.loadingService.dismiss();
    })
  }

  getDetailRadiomu() {
    this.api.get('radiomu/find/'+this.id).then(res => {
      this.radiomuData = res;
      this.loadingService.dismiss();
    }, error => {
      console.log(error);
      this.loadingService.dismiss();
    })
  } 

}
