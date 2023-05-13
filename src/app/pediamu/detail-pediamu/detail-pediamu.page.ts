import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-detail-pediamu',
  templateUrl: './detail-pediamu.page.html',
  styleUrls: ['./detail-pediamu.page.scss'],
})
export class DetailPediamuPage implements OnInit {

  pediamuData:any = {};
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
    this.serverImg = this.common.photoBaseUrl+'pediamu/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailPediamu();
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

  getDetailPediamu() {
    this.api.get('pediamu/find/'+this.id).then(res => {
      this.pediamuData = res;
      this.loadingService.dismiss();
    }, error => {
      console.log(error);
      this.loadingService.dismiss();
    })
  } 

}
