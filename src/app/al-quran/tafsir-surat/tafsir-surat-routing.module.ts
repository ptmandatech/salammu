import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TafsirSuratPage } from './tafsir-surat.page';

const routes: Routes = [
  {
    path: '',
    component: TafsirSuratPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TafsirSuratPageRoutingModule {}
