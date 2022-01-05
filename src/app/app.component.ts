import { Component, NgZone } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router, 
    private diagnostic: Diagnostic,
    private platform: Platform,
    private zone: NgZone,
    private alertController: AlertController,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkPermission();
      Keyboard.addListener('keyboardWillShow', info => {
        console.log('keyboard will show with height:', info.keyboardHeight);
      });
      
      Keyboard.addListener('keyboardDidShow', info => {
        console.log('keyboard did show with height:', info.keyboardHeight);
      });
      
      Keyboard.addListener('keyboardWillHide', () => {
        console.log('keyboard will hide');
      });
      
      Keyboard.addListener('keyboardDidHide', () => {
        console.log('keyboard did hide');
      });
    });
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
            const slug = event.url.split("salammu.id").pop();
            if (slug) {
                this.router.navigateByUrl(slug);
            } else {
              this.router.navigate(['/login']);
            }
            // If no match, do nothing - let regular routing
            // logic take over
        });
    });
  }

  checkPermission() {
    if (this.platform.is('android')) {
      let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
      let errorCallback = (e) => console.error(e);
      
      this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);
    
      this.diagnostic.isGpsLocationAvailable().then(successCallback, errorCallback);
    
     
      this.diagnostic.getLocationMode()
        .then(async (state) => { 
          if (state == this.diagnostic.locationMode.LOCATION_OFF) {
            const confirm = await this.alertController.create({
              header: 'SalamMU',
              message: 'Lokasi belum diaktifkan di perangkat ini. Pergi ke pengaturan untuk mengaktifkan lokasi.',
              buttons: [
                {
                  text: 'Pengaturan',
                  handler: () => {
                    this.diagnostic.switchToLocationSettings();
                  }
                }
              ]
            });
            await confirm.present();
          } else {
            console.log('ok');
          }
        }).catch(e => console.error(e));
    }
  }
}
