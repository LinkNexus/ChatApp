export class ApiError extends Error {
    constructor(public data: Record<string, any>, public status: number) {
        super();
        console.log(data, status);
    }
}

export async function apiFetch<T>(url: string, params: Omit<RequestInit, "body"> & { data?: Record<string, any> } = {}, ld = false) {
    const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "server.instachat.localhost";
    const format = ld ? 'application/ld+json' : 'application/json'; 
    const { data, ...options } = params;

    try {
        const res = await fetch(endpoint + url, {
            method: params.method || params.data ? 'POST' : 'GET',
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'Content-Type': format,
                'Accept': format,
                ...options.headers
            },
            ...options
        });

        if (!res.ok) {
            throw new ApiError(await res.json(), res.status);
        }

        return await res.json() as T;
    } catch (error) {
        console.log(error);
    }
}