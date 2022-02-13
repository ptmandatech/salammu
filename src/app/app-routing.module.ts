import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardGuard } from './auth/guard.guard';
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
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule),
    canLoad: [GuardGuard]
  },
  {
    path: 'my-product',
    loadChildren: () => import('./config/my-product/my-product.module').then( m => m.MyProductPageModule)
  },
  {
    path: 'banner',
    loadChildren: () => import('./config/banner/banner.module').then( m => m.BannerPageModule)
  },
  {
    path: 'tambah-banner/:id',
    loadChildren: () => import('./config/tambah-banner/tambah-banner.module').then( m => m.TambahBannerPageModule)
  },
  {
    path: 'my-video',
    loadChildren: () => import('./config/my-video/my-video.module').then( m => m.MyVideoPageModule)
  },
  {
    path: 'my-cr',
    loadChildren: () => import('./config/my-cr/my-cr.module').then( m => m.MyCrPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'my-pengajian',
    loadChildren: () => import('./config/my-pengajian/my-pengajian.module').then( m => m.MyPengajianPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./auth/change-password/change-password.module').then( m => m.ChangePasswordPageModule),
    canLoad: [GuardGuard]
  },
  {
    path: 'reset/:token',
    loadChildren: () => import('./auth/reset/reset.module').then( m => m.ResetPageModule)
  },  {
    path: 'user-managements',
    loadChildren: () => import('./user-managements/user-managements.module').then( m => m.UserManagementsPageModule)
  },
  {
    path: 'al-quran',
    loadChildren: () => import('./al-quran/al-quran.module').then( m => m.AlQuranPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
