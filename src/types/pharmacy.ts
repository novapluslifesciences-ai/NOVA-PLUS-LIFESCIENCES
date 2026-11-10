export type ProductCategory = 'syrup' | 'sachet';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  volume: string;
  keyIngredients: string;
  activeBioCompounds: string[];
  benefits: string[];
  indications: string[];
  dosage: {
    adults: string;
    pediatrics?: string;
    frequency: string;
  };
  symptoms: string[];
  sugarFree: boolean;
  image: string;
  auraColor: 'blue' | 'teal';
  packaging: {
    unit: string;
    unitsPerCarton: number;
    cartonDimensions: string; // e.g. "36 x 28 x 18 cm"
    cartonWeightKg: number;
    cartonsPerPallet: number;
    shelfLife: string;
    storage: string;
  };
  pricingTier: {
    baseWholesaleUsd: number; // reference unit price
    currencySymbol: string;
  };
  formulationNotes: string;
  fdaAyushStatus: string;
}

export interface SymptomFilter {
  id: string;
  label: string;
  categoryTag: string;
  targetProductId: string;
  iconName: string;
  description: string;
}

export interface B2BQuoteRequest {
  productId: string;
  quantityUnits: number;
  cartons: number;
  pallets: number;
  grossWeightKg: number;
  volumeCbm: number;
  discountPercent: number;
  estimatedTotalUsd: number;
  shippingTier: 'Standard Sea/Ground' | 'Priority Cold-Chain Express' | 'Air Cargo Expedited';
  destinationCountry: string;
}

export interface ComplianceStandard {
  id: string;
  title: string;
  accreditation: string;
  issuingBody: string;
  scope: string;
  inspectionCycle: string;
  description: string;
  keyPoints: string[];
}
