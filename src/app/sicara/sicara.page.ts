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
    this.api.getExternal('organisation').then(res => {
      console.log(res)
    }, error => {
      this.loading = false;
    })
  }

}
