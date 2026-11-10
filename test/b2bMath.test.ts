import test from 'node:test';
import assert from 'node:assert/strict';
import { computeB2BCargoAndPricing } from '../src/utils/b2bMath.ts';

test('computeB2BCargoAndPricing standard syrup batch 2400 units', () => {
  const result = computeB2BCargoAndPricing({
    targetUnits: 2400,
    unitsPerCarton: 48,
    cartonsPerPallet: 40,
    weightPerCartonKg: 10,
    cbmPerCarton: 0.03,
    baseWholesaleRate: 2.50,
  });

  assert.equal(result.actualUnits, 2400);
  assert.equal(result.cartons, 50);
  assert.equal(result.pallets, 2);
  assert.equal(result.grossWeightKg, 500);
  assert.equal(result.totalCbm, 1.5);
  assert.equal(result.discountPercent, 8); // >= 2000 gets 8%
  assert.equal(result.grossTotal, 6000);
  assert.equal(result.discountAmount, 480);
  assert.equal(result.netTotal, 5520);
  assert.equal(result.effectiveUnitPrice, 2.30);
});

test('computeB2BCargoAndPricing small sachet batch rounding to full carton', () => {
  const result = computeB2BCargoAndPricing({
    targetUnits: 500,
    unitsPerCarton: 60,
    cartonsPerPallet: 48,
    weightPerCartonKg: 5.6,
    cbmPerCarton: 0.025,
    baseWholesaleRate: 3.85,
  });

  // 500 / 60 = 8.33 -> 9 cartons
  assert.equal(result.cartons, 9);
  assert.equal(result.actualUnits, 540);
  assert.equal(result.pallets, 1);
  assert.equal(result.discountPercent, 0); // < 1000 has 0%
});
