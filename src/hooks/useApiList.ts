import { useState, useEffect, useCallback } from 'react';

type ParamsGetter = () => Record<string, string | undefined> | undefined;

export default function useApiList<T>(
    endpoint: string,
    deps: any[] = [],
    getParams?: ParamsGetter
) {
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const paramsObj = getParams ? getParams() : undefined;
            let url = endpoint;
            if (paramsObj) {
                const sp = new URLSearchParams();
                Object.entries(paramsObj).forEach(([k, v]) => {
                    if (v !== undefined && v !== null && String(v) !== '') sp.set(k, String(v));
                });
                const qs = sp.toString();
                if (qs) url = `${endpoint}?${qs}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error(await res.text());
            const json = await res.json();
            setData(json as T[]);
        } catch (err: any) {
            setError(err?.message || String(err));
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [endpoint, getParams]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, endpoint]);

    return { data, loading, error, refresh: fetchData };
}
