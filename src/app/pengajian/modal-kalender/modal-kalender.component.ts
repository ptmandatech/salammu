import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-kalender',
  templateUrl: './modal-kalender.component.html',
  styleUrls: ['./modal-kalender.component.scss'],
})
export class ModalKalenderComponent implements OnInit {

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
