import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },  {
    path: 'semua-menu',
    loadChildren: () => import('./semua-menu/semua-menu.module').then( m => m.SemuaMenuPageModule)
  },
  {
    path: 'setting-lokasi',
    loadChildren: () => import('./setting-lokasi/setting-lokasi.module').then( m => m.SettingLokasiPageModule)
  },
  {
    path: 'pilih-lokasi',
    loadChildren: () => import('./pilih-lokasi/pilih-lokasi.module').then( m => m.PilihLokasiPageModule)
  },
  {
    path: 'detail-jadwal-sholat',
    loadChildren: () => import('./detail-jadwal-sholat/detail-jadwal-sholat.module').then( m => m.DetailJadwalSholatPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
