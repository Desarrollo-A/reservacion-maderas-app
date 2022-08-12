import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent} from "./pages/inventory/inventory.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '', component: InventoryComponent, title: 'Inventario' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
