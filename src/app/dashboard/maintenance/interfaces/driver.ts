import { Lookup } from "src/app/core/interfaces/lookup";

export interface Driver{
fullName: string,
date: Date,
nameApplicant: string,
availability: Lookup
}