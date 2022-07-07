import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./pages/login/login.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";

const routes: Routes = [
  {
    path: 'acceso',
    component: LoginComponent,
    title: 'Inicio de sesión'
  },
  {
    path: 'reestablecer',
    component: ForgotPasswordComponent,
    title: 'Reestablecer contraseña'
  },
  { path: '**', redirectTo: 'acceso' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
