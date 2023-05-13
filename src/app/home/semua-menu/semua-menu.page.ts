import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-semua-menu',
  templateUrl: './semua-menu.page.html',
  styleUrls: ['./semua-menu.page.scss'],
})
export class SemuaMenuPage implements OnInit {

  constructor(
    public modalController: ModalController,
    private navparams: NavParams
  ) { }

  dataLogin:any;
  isVisible:boolean = false;
  ngOnInit() {
    this.dataLogin = this.navparams.get('dataLogin');
    if(this.dataLogin) {
      this.isVisible = true;
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
