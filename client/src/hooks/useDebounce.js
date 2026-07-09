import { useState, useEffect } from 'react';

/**
 * Custom React hook that debounces a value by the specified delay.
 *
 * Useful for delaying API calls triggered by user input (e.g., search bars,
 * filter inputs, or live telemetry updates) until the user has stopped typing.
 *
 * @template T
 * @param {T} value - The raw value to debounce.
 * @param {number} [delay=300] - Debounce delay in milliseconds.
 * @returns {T} The debounced value.
 *
 * @example
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 400);
 *
 *   useEffect(() => {
 *     if (debouncedSearch) fetchResults(debouncedSearch);
 *   }, [debouncedSearch]);
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
