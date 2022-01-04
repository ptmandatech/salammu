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
import { HttpClientModule } from '@angular/common/http';
import { ImageUploaderPageModule } from './image-uploader/image-uploader.module';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    AppComponent, 
    ModalJadwalComponent,
    ModalKalenderComponent
  ],
  entryComponents: [
    ModalJadwalComponent,
    ModalKalenderComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ImageUploaderPageModule,
    ImageCropperModule,
  ],
  providers: [
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: LOCALE_ID, useValue: "id-ID" }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
