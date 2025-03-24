import { type FormEventHandler, useCallback, useState, type ComponentProps, useEffect } from "react";
import { ApiError, useApiFetch } from "~/lib/custom/fetch";

export type AjaxFormProps<T> = Omit<ComponentProps<'form'>, 'method'> & {
    onResponse?: ((response: T) => void)|null;
    handleLoading?: ((loading: boolean) => void)|null;
    onRequestError?: ((error: ApiError) => void)|null;
    getFormData?: ((formData: FormData) => void)|null;
    ld?: boolean;
}

export default function<T, >({ 
    action, 
    children, 
    onResponse = null,
    handleLoading = null,
    onRequestError = null,
    getFormData = null,
    ld = false,
    ...props
}: AjaxFormProps<T>) {

    const { load, loading, error, setError } = useApiFetch<T>(action as string, {}, ld);
    const [response, setResponse] = useState<T|null>(null);

    useEffect(() => {
        if (response && onResponse) {
            onResponse(response);
        }
    }, [response, onResponse]);

    useEffect(() => {
        if (handleLoading) {
            handleLoading(loading);
        }
    }, [loading, handleLoading]);

    useEffect(() => {
        if (error && onRequestError) {
            onRequestError(error);
            setError(null);
        }
    }, [error, onRequestError]);

    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async function (e) {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        if (getFormData) {
            getFormData(formData);
        }

        if (props.onSubmit) {
            props.onSubmit(e);
        }

        setResponse(await load(Object.fromEntries(formData.entries())) as T);
    }, []);

    return (
        <form 
            action={action} 
            method='POST' 
            onSubmit={handleSubmit} 
            {...props}
        >
            {children}
        </form>
    )
}