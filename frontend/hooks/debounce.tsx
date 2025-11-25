import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Simple debounce utility for non-React contexts.
 * Usage:
 *   const debounced = debounce((q: string) => fetchData(q), 300);
 *   debounced("term");
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const wrapped = (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, wait);
    };
    (wrapped as T & { cancel: () => void }).cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    return wrapped as T & { cancel: () => void };
}

/**
 * useDebouncedValue — returns a debounced version of a value (e.g., search input).
 * Useful to avoid firing searches on every keystroke.
 * Example:
 *   const debouncedQuery = useDebouncedValue(query, 400);
 *   useEffect(() => { fetch(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebouncedValue<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

/**
 * useDebouncedCallback — returns a debounced callback that can be used in event handlers.
 * Example:
 *   const debouncedSearch = useDebouncedCallback((q) => search(q), 400);
 *   <input onChange={e => debouncedSearch(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(callback: T, delay = 300) {
    const cbRef = useRef(callback);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        cbRef.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = null;
        };
    }, []);

    return useCallback((...args: Parameters<T>) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            cbRef.current(...args);
        }, delay);
    }, [delay]) as T & { cancel?: () => void };
}
