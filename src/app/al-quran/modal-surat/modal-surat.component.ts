import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MusicControls } from '@awesome-cordova-plugins/music-controls/ngx';

@Component({
  selector: 'app-modal-surat',
  templateUrl: './modal-surat.component.html',
  styleUrls: ['./modal-surat.component.scss'],
})
export class ModalSuratComponent implements OnInit {

  detailSurat:any;
  constructor(
    public navParams: NavParams,
    public modalCtrl:ModalController,
    private musicControls: MusicControls
  ) {
  }

  ngOnInit() {
    this.detailSurat = this.navParams.get('detailSurat');
  }

  // play() {
  //   this.musicControls.create({
  //     track       : this.detailSurat.nama_latin,     // optional, default : nothing
  //     // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
  //     //           or a remote url ('http://...', 'https://...', 'ftp://...')
  //     isPlaying   : true,                         // optional, default : true
  //     dismissable : true,                         // optional, default : false
    
  //     // hide previous/next/close buttons:
  //     hasPrev   : false,      // show previous button, optional, default: true
  //     hasNext   : false,      // show next button, optional, default: true
  //     hasClose  : true,       // show close button, optional, default: false
    
  //   // iOS only, optional // optional, default: ''
  //     duration : 60, // optional, default: 0
  //     elapsed : 10, // optional, default: 0
  //     hasSkipForward : true,  // show skip forward button, optional, default: false
  //     hasSkipBackward : true, // show skip backward button, optional, default: false
  //     skipForwardInterval: 15, // display number for skip forward, optional, default: 0
  //     skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
  //     hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional
    
  //     // Android only, optional
  //     // text displayed in the status bar when the notification (and the ticker) are updated, optional
  //     ticker    : 'Sedang Diputar ' + this.detailSurat.nama_latin,
  //     // All icons default to their built-in android equivalents
  //     playIcon: 'media_play',
  //     pauseIcon: 'media_pause',
  //     prevIcon: 'media_prev',
  //     nextIcon: 'media_next',
  //     closeIcon: 'media_close',
  //     notificationIcon: 'notification'
  //    });
    
  //    this.musicControls.subscribe().subscribe(action => {
    
  //      function events(action) {
  //        const message = JSON.parse(action).message;
  //           switch(message) {
  //               case 'music-controls-next':
  //                   // Do something
  //                   break;
  //               case 'music-controls-previous':
  //                   // Do something
  //                   break;
  //               case 'music-controls-pause':
  //                   // Do something
  //                   break;
  //               case 'music-controls-play':
  //                   // Do something
  //                   break;
  //               case 'music-controls-destroy':
  //                   // Do something
  //                   break;
    
  //            // External controls (iOS only)
  //            case 'music-controls-toggle-play-pause' :
  //                   // Do something
  //                   break;
  //            case 'music-controls-seek-to':
  //              const seekToInSeconds = JSON.parse(action).position;
  //              this.musicControls.updateElapsed({
  //                elapsed: seekToInSeconds,
  //                isPlaying: true
  //              });
  //              // Do something
  //              break;
  //            case 'music-controls-skip-forward':
  //              // Do something
  //              break;
  //            case 'music-controls-skip-backward':
  //              // Do something
  //              break;
    
  //               // Headset events (Android only)
  //               // All media button events are listed below
  //               case 'music-controls-media-button' :
  //                   // Do something
  //                   break;
  //               case 'music-controls-headset-unplugged':
  //                   // Do something
  //                   break;
  //               case 'music-controls-headset-plugged':
  //                   // Do something
  //                   break;
  //               default:
  //                   break;
  //           }
  //        }
  //       });
    
  //    this.musicControls.listen(); // activates the observable above
    
  //    this.musicControls.updateIsPlaying(true);
  // }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
