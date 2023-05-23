import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-my-product',
  templateUrl: './my-product.page.html',
  styleUrls: ['./my-product.page.scss'],
})
export class MyProductPage implements OnInit {

  listProducts:any = [];
  listProductsTemp:any = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  listProdukInfinite = [];
  serverImg: any;
  loading:boolean;
  userData:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.listProducts = [];
    this.listProductsTemp = [];
    // this.cekLogin();
  }

  ionViewWillEnter() {
    this.loading = true;
    this.listProducts = [];
    this.listProductsTemp = [];
    this.cekLogin();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listProducts = [];
    this.listProductsTemp = [];
    this.listProdukInfinite = [];
    this.loadingService.present();
    this.cekLogin();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      if(this.userData.role == 'superadmin') {
        this.getUsers();
      }
      this.getAllProducts();
    }, async error => {
      this.loading = false;
      this.listProducts = [];
      this.listProductsTemp = [];
      this.loadingService.dismiss();
    })
  }

  users:any = {};
  getUsers() {
    this.api.get('users').then(res => {
      this.parseUser(res);
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  parseUser(res) {
    for(var i=0; i<res.length; i++) {
      this.users[res[i].id] = res[i];
    }
    this.loadingService.dismiss();
  }

  getAllProducts() {
    if(this.userData.role == 'superadmin') {
      this.api.get('products').then(res => {
        this.parseImage(res);
      }, error => {
        this.loading = false;
      })
    } else {
      this.api.get('products?created_by='+ this.userData.id).then(res => {
        this.parseImage(res);
      }, error => {
        this.loading = false;
      })
    }
    this.loadingService.dismiss();
  }

  async parseImage(res) {
    for(var i=0; i<res.length; i++) {
      let idx = this.listProducts.indexOf(res[i]);

      if(res[i].images != null && res[i].images != '') {
        res[i].images = JSON.parse(res[i].images);
        if(idx == -1) {
          this.listProducts.push(res[i]);
          this.listProductsTemp.push(res[i]);
        }
      } else {
        res[i].images = [];
        if(idx == -1) {
          this.listProducts.push(res[i]);
          this.listProductsTemp.push(res[i]);
        }
      }
    }
    const nextData = this.listProducts.slice(0, 9);
    this.listProdukInfinite = await this.listProdukInfinite.concat(nextData);
    this.loading = false;
  }

  loadData(event) {
    setTimeout(async () => {
      let startIndex = 0;
      if (this.listProdukInfinite.length > 0) {
        startIndex = this.listProdukInfinite.length;
      }
      const nextData = this.listProducts.slice(startIndex, this.listProdukInfinite.length + 9);
      this.listProdukInfinite = this.listProdukInfinite.concat(nextData);
      event.target.complete();

      if (this.listProdukInfinite.length >= this.listProducts.length) {
        event.target.disabled = true;
      }
    }, 500);
  }
  

  initializeItems(): void {
    this.listProducts = this.listProductsTemp;
  }

  searchTerm: string = '';
  async searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      const nextData = this.listProducts.slice(0, 9);
      this.listProdukInfinite = await this.listProdukInfinite.concat(nextData);
      return;
    }

    this.listProdukInfinite = this.listProducts.filter(product => {
      if (product.name && searchTerm) {
        if (product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

}
