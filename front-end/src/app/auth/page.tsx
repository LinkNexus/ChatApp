"use client";

import { AuthHeader } from "@/components/custom/auth/header";
import { AjaxForm } from "@/components/custom/forms/ajax-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store-provider";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

enum RegistrationStatus {
    Unknown = 'unknown',
    Registered = 'registered',
    NotRegistered = 'not-registered'
}

export default function Page() {
    const { email } = useAppStore(state => state);
    const [status, setStatus] = useState<RegistrationStatus>(RegistrationStatus.Unknown);
    const router = useRouter();

    const onResponse = useCallback((response: { isRegistered: boolean }) => {
        if (response.isRegistered) {
            setStatus(RegistrationStatus.Registered);
        } else {
            setStatus(RegistrationStatus.NotRegistered);
        }
    }, []);

    useEffect(() => {
        console.log('Status changed', status);
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

            <AjaxForm onResponse={onResponse} action="/auth/is-registered" className="flex flex-col gap-6">
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