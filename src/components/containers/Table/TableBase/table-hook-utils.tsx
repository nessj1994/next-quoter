import React, { useMemo } from 'react';

const customMultiplierTierValues = [
  { Threshold: 10000, Multiplier: 1.45 },
  { Threshold: 25000, Multiplier: 1.43 },
  { Threshold: 50000, Multiplier: 1.39 },
  { Threshold: 75000, Multiplier: 1.35 },
];

//function calculatePriceWithTier(): {};

export function sumGymLinePrice(arr: any[]): number {
  // Reduce per line setting T1Pricing, T2Pricing, -> T5Pricing, all in one.
  // That should allow us to use a simple sum and compare on the front end at any time
  // which would look like this ->  row.TNPricing = row.UnitPrice * row.Quantity * row.LineMultiplier * multiplierTierN;

  let value = arr.reduce((prev, curr) => prev.LineTotal + curr.LineTotal, 0);
  return value;
}
