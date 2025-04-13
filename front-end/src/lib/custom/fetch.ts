export class ApiError extends Error {
    constructor(public data: Record<string, any>, public status: number) {
        super();
        console.log(data, status);
    }
}

export async function apiFetch<T>(url: string, params: Omit<RequestInit, "body"> & { data?: Record<string, any>, ssr?: boolean, ld?: boolean  } = {}) {
    const { data, ssr, ld, ...options } = params;
    const endpoint = ssr ? process.env.API_ENDPOINT : process.env.NEXT_PUBLIC_API_ENDPOINT || "http://server.instachat.localhost";
    const format = ld ? 'application/ld+json' : 'application/json'; 
    const body = data ? JSON.stringify(data) : undefined;
    const method = params.method || data ? 'POST' : 'GET';
    const headers = {
        'Content-Type': format,
        'Accept': format,
        ...options.headers
    };

    try {
        const res = await fetch(endpoint + url, {
            method,
            body,
            headers,
            credentials: 'include',
            ...options
        });

        if (!res.ok) {
            console.log(await res.json());
            throw new ApiError(await res.json(), res.status);
        }

        return await res.json() as T;
    } catch (error) {
        console.log(error);
    }
}