import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-produk-mu',
  templateUrl: './produk-mu.page.html',
  styleUrls: ['./produk-mu.page.scss'],
})
export class ProdukMUPage implements OnInit {

  listProducts:any = [];
  listProductsTemp:any = [];
  serverImg: any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.getAllProducts();
  }

  getAllProducts() {
    this.api.get('products').then(res => {
      this.parseImage(res);
    })
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
