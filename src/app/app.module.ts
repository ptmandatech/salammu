import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import localeId from '@angular/common/locales/id';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeId, 'id');
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalJadwalComponent } from './jadwal-sholat/modal-jadwal/modal-jadwal.component';
import { ModalKalenderComponent } from './pengajian/modal-kalender/modal-kalender.component';
import { ModalPetaComponent } from './pengajian/modal-peta/modal-peta.component';
import { HttpClientModule } from '@angular/common/http';
import { ImageUploaderPageModule } from './image-uploader/image-uploader.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { QuillModule } from 'ngx-quill';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { SwiperModule } from 'swiper/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { MusicControls } from '@awesome-cordova-plugins/music-controls/ngx';
import { ModalSuratComponent } from './al-quran/modal-surat/modal-surat.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalJadwalComponent,
    ModalKalenderComponent,
    ModalPetaComponent,
    ModalSuratComponent
  ],
  entryComponents: [
    ModalJadwalComponent,
    ModalKalenderComponent,
    ModalPetaComponent,
    ModalSuratComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ImageUploaderPageModule,
    ImageCropperModule,
    QuillModule.forRoot(),
    NgxIonicImageViewerModule,
    SwiperModule,
    IonicSelectableModule
  ],
  providers: [
    StatusBar,
    InAppBrowser,
    SplashScreen,
    DatePipe,
    Diagnostic,
    Geolocation,
    Toast,
    MusicControls,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: LOCALE_ID, useValue: "id-ID" }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
