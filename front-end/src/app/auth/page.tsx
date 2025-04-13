"use client";

import { AuthHeader } from "@/components/custom/auth/header";
import { AjaxForm } from "@/components/custom/forms/ajax-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store-provider";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {useAuth} from "@/lib/custom/auth";

enum RegistrationStatus {
    Unknown = 'unknown',
    Registered = 'registered',
    NotRegistered = 'not-registered'
}

export default function Page() {
    const { email, setEmail, setOTPTimeLeft } = useAppStore(state => state);
    const { user } = useAuth();
    const [status, setStatus] = useState<RegistrationStatus>(RegistrationStatus.Unknown);
    const router = useRouter();

    const onResponse = useCallback((response: { isRegistered: boolean }) => {
        if (response.isRegistered) {
            setStatus(RegistrationStatus.Registered);
        } else {
            setStatus(RegistrationStatus.NotRegistered);
        }
        setOTPTimeLeft(60);
    }, []);

    const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        setEmail(formData.get('email')!.toString());
    }, []);

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    useEffect(() => {
        if (status === RegistrationStatus.Registered) {
            router.push('/auth/login');
        } else if (status === RegistrationStatus.NotRegistered) {
            router.push('/auth/register');
        }
    }, [status, router]);

    return (
        <>
            <AuthHeader message="Welcome to InstaChat">
                <span>
                    Enter your email adress in order to authenticate to our website
                </span>
            </AuthHeader>

            <AjaxForm onSubmit={onSubmit} onResponse={onResponse} action="/auth/is-registered" className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input defaultValue={email} type="email" id="email" name="email" placeholder="john@doe.com" />
                </div>

                <Button className="w-full">
                    Submit
                </Button>
            </AjaxForm>
        </>
    )
}