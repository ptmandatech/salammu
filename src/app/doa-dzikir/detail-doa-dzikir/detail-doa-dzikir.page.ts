import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-detail-doa-dzikir',
  templateUrl: './detail-doa-dzikir.page.html',
  styleUrls: ['./detail-doa-dzikir.page.scss'],
})
export class DetailDoaDzikirPage implements OnInit {

  doaDzikirData:any = {};
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
    this.id = this.routes.snapshot.paramMap.get('id');
    this.cekLogin();
    this.serverImg = this.common.photoBaseUrl+'doadzikir/';
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailDoaDzikir();
    }
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    }, error => {
      console.log(error);
    })
  }

  getDetailDoaDzikir() {
    this.api.get('doadzikir/find/'+this.id).then(res => {
      this.doaDzikirData = res;
    })
  } 

}
