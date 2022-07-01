import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-kalender',
  templateUrl: './modal-kalender.component.html',
  styleUrls: ['./modal-kalender.component.scss'],
})
export class ModalKalenderComponent implements OnInit {

  dateSelected:any;
  listPengajian:any = [];
  loading:boolean;
  times:any;
  constructor(
    public api: ApiService,
    public router: Router,
    public navParams: NavParams,
    public modalController: ModalController,
    private datePipe: DatePipe,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.present();
    this.dateSelected = this.navParams.get('data');
    this.times = this.navParams.get('times');
    let datetime = this.datePipe.transform(new Date(this.dateSelected), 'yyyy-MM-dd');
    this.getPengajian(datetime);
  }

  async present() {
    this.loading = true;
    return await this.loadingController.create({
      spinner: 'crescent',
      duration: 10000,
      message: 'Tunggu Sebentar...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
          this.loading = false;
        }
      });
      this.loading = false;
    });
  }

  getPengajian(datetime) {
    this.api.get('pengajian?all=ok').then(res => {
      this.parseData(res, datetime);
    }, error => {
      this.loading = false;
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
    this.loading = false;
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
