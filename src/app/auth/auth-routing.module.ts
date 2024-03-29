import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./pages/login/login.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { RegisterComponent } from "./pages/register/register.component";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'acceso',
    pathMatch: 'full'
  },
  {
    path: 'acceso',
    component: LoginComponent,
    title: 'Inicio de sesión'
  },
  {
    path: 'restablecer',
    component: ForgotPasswordComponent,
    title: 'Restablecer contraseña'
  },
  {
    path: 'registro',
    component: RegisterComponent,
    title: 'Registrar una cuenta',
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
