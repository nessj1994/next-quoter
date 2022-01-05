import { useState } from 'react';

export default function usePricing(initialValue: Number) {
  const [subtotal, setSubtotal] = useState(initialValue);

  let current = subtotal;

  const get = () => current;

  const set = (newValue: Number): Number => {
    current = newValue;
    setSubtotal(current);
    return current;
  };

  return { get, set };
}
