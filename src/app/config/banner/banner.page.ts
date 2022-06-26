import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.page.html',
  styleUrls: ['./banner.page.scss'],
})
export class BannerPage implements OnInit {

  listBanners:any = [];
  listBannersTemp:any = [];
  serverImg:any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'banners/';
    this.getAllBanners();
  }
  
  onDidViewEnter() {
    this.loading = true;
    this.getAllBanners();
  }

  async doRefresh(event) {
    this.loading = true;
    this.getAllBanners();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllBanners() {
    this.listBanners = [];
    this.listBannersTemp = [];
    this.api.get('banners').then(res => {
      this.listBanners = res;
      this.listBannersTemp = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  initializeItems(): void {
    this.listBanners = this.listBannersTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listBanners = this.listBanners.filter(banner => {
      if (banner.url && searchTerm) {
        if (banner.url.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  update(n) {
    this.router.navigate(['/tambah-banner', n.id])
  }

  delete(n) {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('banners/'+n.id).then(res => {
        if(res) {
          alert('Berhasil menghapus data.');
          this.getAllBanners();
        }
      })
    }
  }

}
