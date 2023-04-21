import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { UserPermissionComponent } from "./pages/user-permission/user-permission.component";
import { AssignPermisionComponent } from "./components/assign-permision/assign-permision.component";

const routes: Routes = [
  { path: '', redirectTo: 'listado', pathMatch: 'full' },
  { path: 'listado', component: UserListComponent, title: 'Listado de usuarios' },
  { path: 'permisos', component: UserPermissionComponent, title: 'Permisos' },
  { path: 'permisos/:id', component: AssignPermisionComponent, title: 'Asignación de permisos' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
