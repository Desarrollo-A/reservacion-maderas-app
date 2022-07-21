import { Lookup } from "src/app/core/interfaces/lookup";

export interface Car{
    businessName: string,
    trademark: string,
    model: string,
    color: string,
    licensePlate: string,
    serie: string,
    circulationCard: string,
    status: Lookup
}