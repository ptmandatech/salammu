import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ModalJadwalComponent } from './jadwal-sholat/modal-jadwal/modal-jadwal.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'jadwal-sholat',
    loadChildren: () => import('./jadwal-sholat/jadwal-sholat.module').then( m => m.JadwalSholatPageModule)
  },
  {
    path: 'modal-jadwal',
    component: ModalJadwalComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }