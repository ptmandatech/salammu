import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-kalender',
  templateUrl: './modal-kalender.component.html',
  styleUrls: ['./modal-kalender.component.scss'],
})
export class ModalKalenderComponent implements OnInit {

  dateSelected:any;
  listPengajian:any = [];
  constructor(
    public api: ApiService,
    public router: Router,
    public navParams: NavParams,
    public modalController: ModalController,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.dateSelected = this.navParams.get('data');
    let datetime = this.datePipe.transform(new Date(this.dateSelected), 'yyyy-MM-dd');
    this.getPengajian(datetime);
  }

  getPengajian(datetime) {
    this.api.get('pengajian').then(res => {
      this.parseData(res, datetime);
    })
  }

  parseData(res, datetime) {
    for(var i=0; i<res.length; i++) {
      let dt = this.datePipe.transform(new Date(res[i].datetime), 'yyyy-MM-dd');
      if(dt == datetime) {
        let idx = this.listPengajian.indexOf(res[i]);
        if(idx == -1) {
          this.listPengajian.push(res[i]);
        }
      }
    }
  }

  detailPengajian(n) {
    this.router.navigate(['/pengajian/detail-pengajian', n.id]);
    this.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
