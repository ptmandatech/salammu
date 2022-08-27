import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.page.html',
  styleUrls: ['./chatting.page.scss'],
})
export class ChattingPage implements OnInit {

  messages = [
    {

      createdAt: 1554090856000,
      msg: 'Saya ada masalah pada tanaman saya yang kurang subur'
    },
    {
      createdAt: 1554090956000,
      msg: 'Tanaman apa nggih pak ?'
    },
    {
      user: 'Fathu Rizqillah',
      createdAt: 1554091056000,
      msg: 'Tanaman Padi pak sekitar umur 90 HST'
    }
  ];

  currentUser = 'Fathu Rizqillah';
  newMsg = '';
  @ViewChild(IonContent, {static: false}) content: IonContent;


  constructor(
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
  }

  sendMessage() {
    this.messages.push({
      user: 'Fathu Rizqillah',
      createdAt: new Date().getTime(),
      msg: this.newMsg
    });

    this.newMsg = '';

    setTimeout(() => {
      this.content.scrollToBottom(400);
    });
  }

  async lampiran() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih',
      buttons: [{
        text: 'Galeri',
        icon: 'image',
        handler: () => {
          console.log('Foto');
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log('Album');
        }
      }]
    });
    await actionSheet.present();
  }


}
