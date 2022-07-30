import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterUstadPage } from './filter-ustad/filter-ustad.page';

@Component({
  selector: 'app-ustadmu',
  templateUrl: './ustadmu.page.html',
  styleUrls: ['./ustadmu.page.scss'],
})
export class UstadmuPage implements OnInit {

  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

   //Modal Filter
   async filter() {
    const modal = await this.modalController.create({
      component: FilterUstadPage,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8, 1]
    });
    return await modal.present();
  }

}
