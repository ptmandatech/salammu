import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlQuranPage } from './al-quran.page';

const routes: Routes = [
  {
    path: '',
    component: AlQuranPage
  },
  {
    path: 'detail-surat/:id',
    loadChildren: () => import('./detail-surat/detail-surat.module').then( m => m.DetailSuratPageModule)
  },
  {
    path: 'tafsir-surat/:id',
    loadChildren: () => import('./tafsir-surat/tafsir-surat.module').then( m => m.TafsirSuratPageModule)
  },  {
    path: 'ayat-tersimpan',
    loadChildren: () => import('./ayat-tersimpan/ayat-tersimpan.module').then( m => m.AyatTersimpanPageModule)
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlQuranPageRoutingModule {}
