import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-my-cr',
  templateUrl: './my-cr.page.html',
  styleUrls: ['./my-cr.page.scss'],
})
export class MyCrPage implements OnInit {

  defaultSegment:any='cabang';

  listCabang:any = [];
  listRanting:any = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
  ) { }

  ngOnInit() {
    this.listRanting = [];
    this.listCabang = [];
    this.getAllCr();
  }

  getAllCr() {
    this.api.get('cr').then(res => {
      this.parseData(res);
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
  }

}
