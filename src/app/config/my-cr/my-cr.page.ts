import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-my-cr',
  templateUrl: './my-cr.page.html',
  styleUrls: ['./my-cr.page.scss'],
})
export class MyCrPage implements OnInit {

  defaultSegment = 'cabang';

  listCabang:any = [];
  listRanting:any = [];
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingService.present();
    this.listRanting = [];
    this.listCabang = [];
    this.getAllCr();
  }

  onDidViewEnter() {
    this.loading = true;
    this.listRanting = [];
    this.listCabang = [];
    this.getAllCr();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listRanting = [];
    this.listCabang = [];
    this.loadingService.present();
    this.getAllCr();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllCr() {
    this.api.get('cr').then(res => {
      this.parseData(res);
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  parseData(res) {
    for(var i=0; i<res.length; i++) {
      if(res[i].category == 'cabang') {
        let idx = this.listCabang.indexOf(res[i]);
        if(idx == -1) {
          this.listCabang.push(res[i]);
        }
      } else {
        let idx = this.listRanting.indexOf(res[i]);
          if(idx == -1) {
            this.listRanting.push(res[i]);
          }
      }
    }
    this.loadingService.dismiss();
    this.loading = false;
  }

  addCr(id) {
    this.router.navigate(['/cabang-ranting/tambah-cabang-ranting/'+this.defaultSegment+'/'+id]);
  }

}
