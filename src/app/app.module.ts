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
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent, 
    ModalJadwalComponent
  ],
  entryComponents: [
    ModalJadwalComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: LOCALE_ID, useValue: "id-ID" }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
