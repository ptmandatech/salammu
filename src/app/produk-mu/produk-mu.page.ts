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
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.listProducts = [];
    this.listProductsTemp = [];
    this.getAllProducts();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listProducts = [];
    this.listProductsTemp = [];
    this.getAllProducts();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllProducts() {
    this.api.get('products?all=ok').then(res => {
      this.parseImage(res);
    }, error => {
      this.loading = false;
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

  // Pilihan Kategori 
  selectedCat:any;
  selectCat(cat)
  {
  		if(this.selectedCat!=cat)
  		{
  			this.selectedCat=cat;
  		}else{
  			this.selectedCat=null;
  		} 
  }

}
