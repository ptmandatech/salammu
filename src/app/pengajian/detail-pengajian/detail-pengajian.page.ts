import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-detail-pengajian',
  templateUrl: './detail-pengajian.page.html',
  styleUrls: ['./detail-pengajian.page.scss'],
})
export class DetailPengajianPage implements OnInit {

  pengajianData:any;
  id:any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.id = this.routes.snapshot.paramMap.get('id');
    this.getDetailPengajian();
  }

  getDetailPengajian() {
    this.api.get('pengajian/find/'+this.id).then(res => {
      this.pengajianData = res;
    })
  }

}
