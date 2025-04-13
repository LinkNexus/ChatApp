'use client'

import { ApiError, apiFetch } from "@/lib/custom/fetch";
import { ComponentProps, useEffect, useState } from "react";

interface AjaxFormProps<T> extends ComponentProps<"form"> {
    action: string,
    onRequestError?: (error: ApiError) => void,
    onResponse?: (response: T) => void,
    handleLoading?: (loading: boolean) => void,
    ld?: boolean,
    additionalData?: Record<string, any>,
}

export function AjaxForm<T,>({
    action,
    children,
    onRequestError,
    onResponse,
    handleLoading,
    ld = false,
    method = 'POST',
    additionalData = {},
    ...props
}: AjaxFormProps<T>) {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (loading && handleLoading) handleLoading(loading);
    })

    async function handleAction(formData: FormData) {
        setLoading(true);
        try {
            const response = await apiFetch(action, {
                method,
                data: {
                    ...Object.fromEntries(formData.entries()),
                    ...additionalData
                },
                ld,
                ssr: false,
                // headers: {
                //     'Content-Type': 'text/html',
                //     'Accept': 'text/html'
                // }
            });

            if (onResponse) onResponse(response as T);
        } catch (error) {
            if (error instanceof ApiError && onRequestError) {
                onRequestError(error)
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleAction} {...props}>
            {children}
        </form>
    )
}