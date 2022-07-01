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
    this.allCategories = [{
      id: 'semua',
      name: 'Semua'
    }];
    this.getCategories();
    this.getAllProducts();
  }

  async doRefresh(event) {
    this.loading = true;
    this.listProducts = [];
    this.listProductsTemp = [];
    this.allCategories = [{
      id: 'semua',
      name: 'Semua'
    }];
    this.getCategories();
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

  allCategories:any = [
    {
      id: 'semua',
      name: 'Semua'
    }
  ];
  getCategories() {
    this.api.get('categories').then(res=>{
      this.allCategories = [...this.allCategories, ...res];
      console.log(this.allCategories)
    }, err => {
    });
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
    if(this.selectedCat != 'semua') {
      this.listProducts = this.listProducts.filter(product => {
        if (product.category && this.selectedCat) {
          if (product.category.toLowerCase().indexOf(this.selectedCat.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    }
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listProducts = this.listProducts.filter(product => {
      if(this.selectedCat != 'semua') {
        if (product.category && this.selectedCat) {
          if (product.category.toLowerCase().indexOf(this.selectedCat.toLowerCase()) > -1) {
            if (product.name && searchTerm) {
              if (product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                return true;
              }
              return false;
            }
            return true;
          }
          return false;
        }
      } else {
        if (product.name && searchTerm) {
          if (product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }

      }
    });
  }

  // Pilihan Kategori 
  selectedCat:any = 'semua';
  selectCat(cat)
  {
  		if(this.selectedCat != cat.id)
  		{
  			this.selectedCat = cat.id;
  		}else{
  			this.selectedCat=null;
  		} 
      if(this.selectedCat == 'semua') {
        this.listProducts = [];
        this.initializeItems();
      } else {
        this.initializeItems();
        this.listProducts = this.listProducts.filter(product => {
          if (product.category && this.selectedCat) {
            if (product.category.toLowerCase().indexOf(this.selectedCat.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
        });
      }
  }

}
