import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-peta',
  templateUrl: './modal-peta.component.html',
  styleUrls: ['./modal-peta.component.scss'],
})
export class ModalPetaComponent implements OnInit {

  constructor(
    public Router: Router,
    public modalController: ModalController,
  ) { }

  ngOnInit() {}

  detailPengajian() {
    this.Router.navigate(['/pengajian/detail-pengajian']);
    this.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
