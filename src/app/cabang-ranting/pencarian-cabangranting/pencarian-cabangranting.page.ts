import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pencarian-cabangranting',
  templateUrl: './pencarian-cabangranting.page.html',
  styleUrls: ['./pencarian-cabangranting.page.scss'],
})
export class PencarianCabangrantingPage implements OnInit {

  listCr:any = [];
  listCrTemp:any = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
  ) { }

  ngOnInit() {
    this.listCr = [];
    this.getAllCr();
  }

  getAllCr() {
    this.api.get('cr').then(res => {
      this.listCr = res;
      this.listCrTemp = res;
    })
  }

  initializeItems(): void {
    this.listCr = this.listCrTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listCr = this.listCr.filter(cr => {
      if (cr.name && searchTerm) {
        if (cr.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

}
