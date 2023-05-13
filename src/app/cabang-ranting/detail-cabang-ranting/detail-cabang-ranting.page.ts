import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ModalPetaComponent } from 'src/app/pengajian/modal-peta/modal-peta.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-detail-cabang-ranting',
  templateUrl: './detail-cabang-ranting.page.html',
  styleUrls: ['./detail-cabang-ranting.page.scss'],
})
export class DetailCabangRantingPage implements OnInit {

  id:any;
  cr:any;
  isCreated:boolean = true;
  loading:boolean;
  crData:any = {};
  userData:any;
  defaultSegment:any='tentang';
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.loading = true;
    this.id = this.routes.snapshot.paramMap.get('id');
    this.cr = this.routes.snapshot.paramMap.get('cr');
    this.cekLogin();
    this.getDetailCr();
    this.getPengajian();
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

  getDetailCr() {
    this.api.get('cr/find/'+this.id).then(res => {
      this.crData = res;
      this.loadingService.dismiss();
    }, error => {
      console.log(error);
      this.loadingService.dismiss();
    })
  }

  listPengajian:any = [];
  getPengajian() {
    this.api.get('pengajian?cr='+ this.cr+'&&id='+ this.id).then(res => {
      this.listPengajian = res;
      this.loading = false;
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  async modalPeta(dataPengajian) {
    const modal = await this.modalController.create({
      component: ModalPetaComponent,
      componentProps: {data:dataPengajian},
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
    });
    return await modal.present();
  }

}
