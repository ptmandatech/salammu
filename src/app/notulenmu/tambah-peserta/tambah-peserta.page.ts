import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tambah-peserta',
  templateUrl: './tambah-peserta.page.html',
  styleUrls: ['./tambah-peserta.page.scss'],
})
export class TambahPesertaPage implements OnInit {

  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {

  }

  userData:any = {};
  simpan() {
    let user = {
      id: new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))],
      name: this.userData.name,
      checked: true
    }

    this.modalController.dismiss(user);
  }

}
