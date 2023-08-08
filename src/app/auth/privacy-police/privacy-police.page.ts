import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-privacy-police',
  templateUrl: './privacy-police.page.html',
  styleUrls: ['./privacy-police.page.scss'],
})
export class PrivacyPolicePage implements OnInit {

  constructor(private api: ApiService,) { }

  ngOnInit() {
    this.getConfig();
  }

  privacyPolice:any = '';
  getConfig() {
    this.api.get('config').then((res:any) => {
      for(var i=0; i<res.length; i++) {
        if(res[i].key == "privacy_police") {
          this.privacyPolice = res[i].value;
        }
      }
    }, err => {
      console.log(err);
    })
  }

}
