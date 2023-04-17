import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-my-product',
  templateUrl: './my-product.page.html',
  styleUrls: ['./my-product.page.scss'],
})
export class MyProductPage implements OnInit {

  listProducts:any = [];
  listProductsTemp:any = [];
  serverImg: any;
  loading:boolean;
  userData:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.present();
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
  
  async present() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      duration: 2000,
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

  async doRefresh(event) {
    this.loading = true;
    this.listProducts = [];
    this.listProductsTemp = [];
    this.present();
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
    })
  }

  users:any = {};
  getUsers() {
    this.api.get('users').then(res => {
      this.parseUser(res);
    }, error => {
      this.loading = false;
    })
  }

  parseUser(res) {
    for(var i=0; i<res.length; i++) {
      this.users[res[i].id] = res[i];
    }
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
  }

  parseImage(res) {
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
    this.loading = false;
  }
  

  initializeItems(): void {
    this.listProducts = this.listProductsTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listProducts = this.listProducts.filter(product => {
      if (product.name && searchTerm) {
        if (product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

}
