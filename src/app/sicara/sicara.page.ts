import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-sicara',
  templateUrl: './sicara.page.html',
  styleUrls: ['./sicara.page.scss'],
})
export class SicaraPage implements OnInit {

  listWilayah:any = [];
  listWilayahTemp:any = [];
  listDaerah:any = [];
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getAllWilayah();
  }

  getAllWilayah() {
    this.api.get('sicara/getAllPWM').then(res => {
      this.listWilayah = res;
      this.listWilayahTemp = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  initializeItems(): void {
    this.listWilayah = this.listWilayahTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listWilayah = this.listWilayah.filter(data => {
      if (data.nama && searchTerm) {
        if (data.nama.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  getChildDaerah(n) {
    this.api.get('sicara/getPDM/'+n.id).then(res => {
      this.listDaerah = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

}
