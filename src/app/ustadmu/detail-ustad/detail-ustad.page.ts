import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detail-ustad',
  templateUrl: './detail-ustad.page.html',
  styleUrls: ['./detail-ustad.page.scss'],
})
export class DetailUstadPage implements OnInit {

  loading:boolean;
  detailUstad:any = {};
  isCreated:boolean;
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public router:Router,
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.info) {
        const info = JSON.parse(data.info);
        this.detailUstad = info;
        this.isCreated = false;
      } else {
        this.isCreated = true;
        this.detailUstad = {};
      }
    });
   }

  ngOnInit() {
  }

  aksi(aksi) {
    if(aksi == 'wa') {
      var nomor = Number(this.detailUstad.phone);
      let msg = 'https://api.whatsapp.com/send?phone=+62'+nomor+'&text=Assalamu’alaikum%20Warahmatullahi%20Wabarakatuh,%20Izin%20tanya%20Ustadz%20saya%20mendapatkan%20kontak%20dari%20aplikasi%20SalamMU.';
      window.open(msg, '_system');
    } else {

    }
  }

}
