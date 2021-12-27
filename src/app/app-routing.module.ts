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
  {
    path: 'pengajian',
    loadChildren: () => import('./pengajian/pengajian.module').then( m => m.PengajianPageModule)
  },
  {
    path: 'cabang-ranting',
    loadChildren: () => import('./cabang-ranting/cabang-ranting.module').then( m => m.CabangRantingPageModule)
  },
  {
    path: 'produk-mu',
    loadChildren: () => import('./produk-mu/produk-mu.module').then( m => m.ProdukMUPageModule)
  },
  {
    path: 'video',
    loadChildren: () => import('./video/video.module').then( m => m.VideoPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
