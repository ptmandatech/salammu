import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-detail-khutbah',
  templateUrl: './detail-khutbah.page.html',
  styleUrls: ['./detail-khutbah.page.scss'],
})
export class DetailKhutbahPage implements OnInit {

  loading:boolean;
  detailKhutbah:any = {};
  isCreated:boolean;
  serverImg: any;
  constructor(
    private route: ActivatedRoute,
    public common: CommonService,
    public api: ApiService,
    public router:Router,
  ) {
    this.serverImg = this.common.photoBaseUrl+'khutbah/';
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.info) {
        const info = JSON.parse(data.info);
        this.detailKhutbah = info;
        this.isCreated = false;
      } else {
        this.isCreated = true;
        this.detailKhutbah = {};
      }
    });
   }

  ngOnInit() {
  }

}
