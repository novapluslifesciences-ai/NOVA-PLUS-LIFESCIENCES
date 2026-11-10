export interface B2BCalculationInput {
  targetUnits: number;
  unitsPerCarton: number;
  cartonsPerPallet: number;
  weightPerCartonKg: number;
  cbmPerCarton: number;
  baseWholesaleRate: number;
}

export interface B2BCalculationOutput {
  actualUnits: number;
  cartons: number;
  pallets: number;
  grossWeightKg: number;
  totalCbm: number;
  discountPercent: number;
  grossTotal: number;
  discountAmount: number;
  netTotal: number;
  effectiveUnitPrice: number;
}

export function computeB2BCargoAndPricing(input: B2BCalculationInput): B2BCalculationOutput {
  const cartons = Math.ceil(Math.max(1, input.targetUnits) / input.unitsPerCarton);
  const actualUnits = cartons * input.unitsPerCarton;
  const pallets = Math.ceil(cartons / input.cartonsPerPallet);
  const grossWeightKg = Math.round(cartons * input.weightPerCartonKg);
  const totalCbm = parseFloat((cartons * input.cbmPerCarton).toFixed(2));

  let discountPercent = 0;
  if (actualUnits >= 20000) {
    discountPercent = 22;
  } else if (actualUnits >= 10000) {
    discountPercent = 18;
  } else if (actualUnits >= 5000) {
    discountPercent = 14;
  } else if (actualUnits >= 2000) {
    discountPercent = 8;
  } else if (actualUnits >= 1000) {
    discountPercent = 4;
  }

  const grossTotal = actualUnits * input.baseWholesaleRate;
  const discountAmount = grossTotal * (discountPercent / 100);
  const netTotal = grossTotal - discountAmount;
  const effectiveUnitPrice = parseFloat((netTotal / actualUnits).toFixed(2));

  return {
    actualUnits,
    cartons,
    pallets,
    grossWeightKg,
    totalCbm,
    discountPercent,
    grossTotal,
    discountAmount,
    netTotal,
    effectiveUnitPrice,
  };
}
