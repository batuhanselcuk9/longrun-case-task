import { useState, useEffect } from 'react';

/**
 * Delays updating the returned value until the specified delay has passed
 * without the input changing. Useful for preventing excessive API calls
 * on rapid user input (e.g. search fields, price inputs).
 *
 * @param value  - The value to debounce
 * @param delay  - Delay in milliseconds (default: 400ms)
 */
function useDebounce<T>(value: T, delay: number = 400): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timer if value changes before delay expires
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
