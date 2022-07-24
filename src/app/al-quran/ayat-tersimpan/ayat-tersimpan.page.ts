import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-ayat-tersimpan',
  templateUrl: './ayat-tersimpan.page.html',
  styleUrls: ['./ayat-tersimpan.page.scss'],
})
export class AyatTersimpanPage implements OnInit {

  constructor(
    public actionSheetController:ActionSheetController,
  ) { }

  ngOnInit() {
  }

  //bookmark
  async actionAyat() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Aksi Ayat Tersimpan',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Lihat Ayat Tersimpan',
        icon: 'book-outline',
        data: 10,
        handler: () => {
          console.log('Lihat clicked');
        }
      }, {
        text: 'Hapus Ayat',
        icon: 'trash-outline',
        data: 'Data value',
        handler: () => {
          console.log('Hapus clicked');
        }
      }, {
        text: 'Batalkan',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

}
