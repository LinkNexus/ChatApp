'use client';

import { AuthHeader } from "@/components/custom/auth/header";
import { AjaxForm } from "@/components/custom/forms/ajax-form";
import { LoaderButton } from "@/components/custom/loader-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/custom/fetch";
import { formErrors } from "@/lib/custom/forms";
import { useAppStore } from "@/store-provider";
import { User } from "@/types";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page () {
    const router = useRouter();
    const [error, setError] = useState<ApiError|null>(null);
    const { getError, hasError, clearError } = formErrors(error, setError);
    const [loading, setLoading] = useState(false);
    const { email, setUser, user } = useAppStore(state => state);

    console.log(email, user);

    const onResponse = useCallback((response: User) => {
        setUser(response);
    }, [setUser, router]);

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    return (
        <>
            <AuthHeader message="Join Instachat's Community!">
                Enter the required information to create your account.
            </AuthHeader>

            <AjaxForm
                action="/auth/register"
                onRequestError={setError}
                method="POST"
                className="flex flex-col gap-6" 
                handleLoading={setLoading}
                onResponse={onResponse}
                ld
            >
                <div className="grid gap-2">
                    <Label htmlFor='email'>Email</Label>
                    <div className={'flex gap-x-2'}>
                        <Input onChange={() => clearError('email')} readOnly name={"email"} id="email" type="email" value={email || ''} required />
                        <Pencil className={'h-full'} onClick={() => router.push('/auth')} />
                    </div>
                    {hasError('email') && <span className="text-red-300 text-sm">{getError('email')}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input onChange={() => clearError('name')} className={hasError('name') ? 'border-red-500' : ''} name="name" autoFocus required placeholder="John Doe" />
                    {hasError('name') && <span className="text-red-500 text-sm">{getError('name')}</span>}
                </div>

                <LoaderButton loading={loading}>
                    Create Account
                </LoaderButton>
            </AjaxForm>
        </>
    )
}