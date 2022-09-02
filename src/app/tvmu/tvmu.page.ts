import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tvmu',
  templateUrl: './tvmu.page.html',
  styleUrls: ['./tvmu.page.scss'],
})
export class TvmuPage implements OnInit {

  loading:boolean;
  constructor(
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.present();
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
          setTimeout(() => {
            a.dismiss().then(() => console.log('abort presenting'));
            this.loading = false;
          }, 3000)
        }
      });
      this.loading = false;
    });
  }

}
