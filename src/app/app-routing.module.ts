import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from "./core/guards/login.guard";
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";


const routes: Routes = [
  {path: 'draw/:room', component: RoomComponent},
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivateChild: [
      LoginGuard
    ],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivateChild: [
      AuthGuard
    ]
  },
  {
    path: 'paqueteria', 
    loadChildren: () => import ('./package/package.module').then(m => m.PackageModule)
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
