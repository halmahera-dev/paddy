import catalog from "@/features/nisar/nisar-pairs.json";

export type InterferogramPair = (typeof catalog.pairs)[number];

export const interferogramCatalog = catalog;
