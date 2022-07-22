import { Lookup } from "src/app/core/interfaces/lookup";
export interface Inventory{
    name: string,
    description: string,
    cantidadStock: number,
    status: Lookup,
    typeInventory: Lookup,
    unit: Lookup,
}