import {useCallback, useState} from "react";
const endpoint = "http://levynkeneng-2.tail6ac1e7.ts.net";

export function useApiFetch<T>(url: string, params: Omit<RequestInit, "body"> = {}) {
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const load = useCallback(async function (data: Record<string, any>) {
        setLoading(true);
        await useDelay(5000);
        try {
            const res = await fetch(endpoint + url, {
                method: "POST",
                body: JSON.stringify(data),
                ...params,
                headers: {
                    "Content-Type": "application/json",
                    ...params.headers
                }
            });

            if (!res.ok) {
                setError(res.statusText);
                console.log(res.statusText, res.status)
                return;
            }

            return await res.json() as T;
        } catch (e) {
            setError(e);
            console.log(e)
        } finally {
            setLoading(false);
        }
    }, [endpoint, url, params, error, loading]);

    return {
        load,
        error,
        loading,
    }
}

function useDelay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}