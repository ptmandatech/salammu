import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-setting-lokasi',
  templateUrl: './setting-lokasi.page.html',
  styleUrls: ['./setting-lokasi.page.scss'],
})
export class SettingLokasiPage implements OnInit {

  constructor(public modalController: ModalController,) { }

  ngOnInit() {
  }

  dismiss(data) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss(data);
  }

}
