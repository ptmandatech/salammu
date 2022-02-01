import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-semua-menu',
  templateUrl: './semua-menu.page.html',
  styleUrls: ['./semua-menu.page.scss'],
})
export class SemuaMenuPage implements OnInit {

  constructor(public modalController: ModalController,) { }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
