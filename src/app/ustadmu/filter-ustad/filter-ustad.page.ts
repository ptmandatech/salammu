import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-filter-ustad',
  templateUrl: './filter-ustad.page.html',
  styleUrls: ['./filter-ustad.page.scss'],
})
export class FilterUstadPage implements OnInit {

  serverImg: any;
  loading:boolean;
  filterData:any = {};
  @Input() data: any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private navParams: NavParams,
    private loadingController: LoadingController,
  ) {
    let dt = this.navParams.get('data');
    this.filterData = dt == undefined ? {}:dt;
  }

  async ngOnInit() {
    this.loading = true;
    this.present();
    await this.getProvinsi();
    this.getAllScience();
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

  allSciences:any=[];
  getAllScience() {
    this.allSciences = [];
    this.api.get('sciences').then(res=>{
      this.allSciences=res;
    })
  }

  allProvinsi:any=[];
  getProvinsi()
  {
    this.loading = true;
    this.api.get('alamat/provinsi').then(res=>{
      this.allProvinsi=res;
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  }

  allKab:any=[];
  getKab()
  {
    this.loading = true;
    this.api.get('alamat/kabupaten?prov_id='+this.filterData.prov_id).then(res=>{
      this.allKab=res;
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  }

  allKec:any=[];
  getKec()
  {
    this.loading = true;
    this.api.get('alamat/kecamatan?kab_id='+this.filterData.kab_id).then(res=>{
      this.allKec=res;
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  } 

  selectCat(data) {
    this.filterData.science = data.id;
  }

  dismiss(status) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss(status == 'ok' ? this.filterData:null);
  }

}
