'use client';

import { AuthHeader } from "@/components/custom/auth/header";
import { AjaxForm } from "@/components/custom/forms/ajax-form";
import { LoaderButton } from "@/components/custom/loader-button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/custom/fetch";
import { useAppStore } from "@/store-provider";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import { toast } from "sonner";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/lib/custom/auth";
import {User} from "@/types";

export default function () {
    const { email, otpTimeLeft, setOTPTimeLeft } = useAppStore(state => state);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { generateOTP, user, setUser } = useAuth();

    function onError(error: ApiError) {
        toast.error("Error during login", {
            description: error.data.message as string,
            closeButton: true
        });
    }

    const onResponse = useCallback(function (response: User) {
        setUser(response);
        setOTPTimeLeft(0);
    }, [setUser, setOTPTimeLeft]);

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    useEffect(() => {
        const otpTimer = setInterval(() => {
            if (otpTimeLeft > 0) {
                setOTPTimeLeft(otpTimeLeft - 1);
            }
        }, 1000);

        return () => clearInterval(otpTimer);
    }, [otpTimeLeft, setOTPTimeLeft]);
    
    return (
        <>
            <AuthHeader message='Welcome back to InstaChat'>
                <span>
                    Enter the One Time Password sent to you by email in order to authenticate to our website
                </span>
            </AuthHeader>

            <AjaxForm 
                action='/auth/login'
                className="flex flex-col gap-6"
                onResponse={onResponse}
                handleLoading={setLoading}
                onRequestError={onError}
            >
                <div className="grid gap-2">
                    <Label htmlFor='email'>Email</Label>
                    <div className={'flex gap-x-2'}>
                        <Input readOnly name={"email"} id="email" type="email" value={email || ''} required />
                        <Pencil className={'h-full'} onClick={() => router.push('/auth')} />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor='otp'>One Time Password</Label>
                    <InputOTP name={'otp'} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                        <InputOTPGroup>
                            {Array(6).fill(0).map((_, i) => (
                                <InputOTPSlot key={'input-slot' + i} index={i} />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className='flex gap-[10px] w-full flex-col lg:flex-row'>
                    <Button type='button' disabled={otpTimeLeft !== 0} onClick={generateOTP} variant='outline' className='lg:w-[calc(50%-5px)] w-full'>
                        Resend Code {otpTimeLeft > 0 ? `in ${otpTimeLeft}s` : ''}
                    </Button>
                    <LoaderButton loading={loading} type={"submit"} className='lg:w-[calc(50%-5px)] w-full'>
                        Submit
                    </LoaderButton>
                </div>
            </AjaxForm>
        </>
    );
}