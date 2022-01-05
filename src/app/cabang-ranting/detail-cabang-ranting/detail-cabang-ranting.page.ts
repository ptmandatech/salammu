import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-detail-cabang-ranting',
  templateUrl: './detail-cabang-ranting.page.html',
  styleUrls: ['./detail-cabang-ranting.page.scss'],
})
export class DetailCabangRantingPage implements OnInit {

  id:any;
  isCreated:boolean = true;
  loading:boolean;
  crData:any = {};
  userData:any;
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
    this.cekLogin();
    this.getDetailCr();
  }

  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    }, error => {
      console.log(error);
    })
  }

  getDetailCr() {
    this.api.get('cr/find/'+this.id).then(res => {
      this.crData = res;
    })
  }

  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('cr/'+this.id).then(res => {
        if(res) {
          alert('Berhasil menghapus data.');
          this.loading = false;
          this.router.navigate(['/my-cr']);
        }
      })
    }
  }

}
