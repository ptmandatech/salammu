import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;
  loaderCounter = 0;
  loading: HTMLIonLoadingElement;

  constructor(public loadingController: LoadingController) { }

  async present() {
    this.loaderCounter = this.loaderCounter + 1;

    if(this.loaderCounter == 1){
      this.isLoading = true;
      
      return await this.loadingController.create({
        message: "Mohon tunggu, data sedang diproses.",
        spinner: 'crescent'
      }).then(a => {
        a.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            this.isLoading = false;
            this.loaderCounter = 0;
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
    }
  }

  async dismiss() {
    this.loaderCounter = 0;
    this.isLoading = false;
    await this.loadingController.dismiss();
  }
}
