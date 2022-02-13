import { Component, NgZone, ViewChild } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, NavController, Platform, ToastController } from '@ionic/angular';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Keyboard } from '@capacitor/keyboard';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = require('sweetalert');
import { Network } from '@capacitor/network';
import { Location } from "@angular/common";
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  @ViewChild(IonRouterOutlet, {static: false}) routerOutlet: IonRouterOutlet;
  private lastBackTime: number = 0;
  private intervalExitApp: number = 2000;
  constructor(
    private router: Router, 
    private diagnostic: Diagnostic,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private zone: NgZone,
    private alertController: AlertController,
    private navController: NavController,
    private toastController: ToastController,
    private location: Location,
    private toast: Toast
  ) {
    this.initializeApp();
    this.platform.backButton.subscribe(() => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/profil' || this.router.url === '/login' || 
        this.router.url === '/video' || this.router.url === '/pengajian' || this.router.url === '/produk-mu' || 
        this.router.url === '/jadwal-sholat' || this.router.url === '/cabang-ranting') {
        this.router.navigate(['/home']);
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#349075');

      this.checkPermission();
      this.cekKoneksi();
      this.backButtonEvent();
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

  private backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      let currentTime = new Date().getTime();
      console.log("currentTime", currentTime);
      console.log("lastBackTime -> ", this.lastBackTime);
      console.log("Subtraction -> ", currentTime - this.lastBackTime);
      if (
        !this.routerOutlet.canGoBack() &&
        this.lastBackTime &&
        this.lastBackTime > 0 &&
        currentTime - this.lastBackTime < this.intervalExitApp
      ) {
        navigator["app"].exitApp();
        return;
      }
      if (!this.routerOutlet.canGoBack()) {
        this.createToastExitApp();
      } else {
        this.routerOutlet.pop();
      }
      console.log("backButton.subscribeWithPriority");
    });
  }

  private createToastExitApp() {
    this.toastController
      .create({
        message: 'Tekan sekali lagi untuk keluar',
        duration: 2000,
        color: "primary",
      })
      .then((toastEl) => {
        toastEl.present();
        this.lastBackTime = new Date().getTime();
      });
  }

  networkListener: any;
  networkStatus: any;
  async cekKoneksi() {
    this.networkListener = Network.addListener('networkStatusChange', status => {
      this.networkStatus = status;
      if(this.networkStatus.connected == false) {
        swal({
          title: "Tidak Ada Koneksi Internet",
          text: "Silahkan cek kembali koneksi internet anda.",
          icon: "warning"
        });
      }
    });
    this.networkStatus = await Network.getStatus();
  }

  ngOnDestroy() {
    this.platform.backButton.unsubscribe();
    this.networkListener.remove();
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
