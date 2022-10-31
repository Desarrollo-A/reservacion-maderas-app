import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputOutputInventoryComponent} from "./pages/input-output-inventory/input-output-inventory.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
  {path: '', redirectTo: 'entrada-salida', pathMatch: 'full'},
  { path: 'entrada-salida', component: InputOutputInventoryComponent, title: 'Inventario' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
