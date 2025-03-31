import {useCallback, useState} from "react";
const endpoint = import.meta.env.VITE_API_ENDPOINT

export class ApiError extends Error {
    constructor(public status: number, public data: Record<string, unknown>, public url: string) {
        super();
    }
}

export interface ApiFetchParams extends Omit<RequestInit, 'body'> {
    data?: Record<string, any>;
}

export async function apiFetch<T>(url: string, params: ApiFetchParams = {}) {
    params.method ??= params.data ? 'POST' : 'GET';
    const body = params.data ? JSON.stringify(params.data) : undefined;
    const res = await fetch(endpoint + url, {
        ...params,
        body,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...params.headers
        }
    });

    if (res.ok) {
        return await res.json() as T;
    }

    throw new ApiError(res.status, await res.json(), url);
}

export function jsonLdFetch<T>(url: string, params: (Omit<RequestInit, 'body'> & { data?: Record<string, unknown>}) = {}) {
    return apiFetch<T>(url, {
        ...params,
        headers: {
            ...params.headers,
            'Accept': 'application/ld+json',
            'Content-Type': 'application/ld+json',
        },
    });
}

export function useApiFetch<T>(url: string, params: Omit<ApiFetchParams, "data">, ld: boolean = false) {
    const [error, setError] = useState<ApiError|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const load = useCallback(async function (data?: Record<string, any>) {
        setLoading(true);

        try {
            if (ld) {
                return await jsonLdFetch<T>(url, {
                    data: data,
                    ...params
                });
            }

            return await apiFetch<T>(url, {
                data: data,
                ...params
            })
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }, [url, params]);

    return {
        load,
        error,
        loading,
        setError
    }
}

function useDelay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}