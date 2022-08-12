import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
