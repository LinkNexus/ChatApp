import Header from '~/components/custom/auth/header';
import AjaxForm from '~/components/custom/forms/ajax-form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Pencil } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router';
import { useStore } from '~/store';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import LoadingButton from '~/components/custom/forms/loading-button';
import { useEffect, useState } from 'react';
import type { ApiError } from '~/lib/custom/fetch';
import { toast } from 'sonner';
import { useAuth } from '~/lib/custom/auth';

export default function () {
    const [loading, setLoading] = useState(false);
    const email = useStore.use.email();
    const user = useStore.use.user();
    const setUser = useStore.getState().setUser;
    const [time, setTime] = useState(60);
    const navigate = useNavigate();
    const { generateOTP} = useAuth();

    function onError(error: ApiError) {
        toast.error("Error during login", {
            description: error.data.message as string,
            closeButton: true
        });
    }

    useEffect(() => {
        if (time > 0) {
            const interval = setInterval(() => {
                setTime(time - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [time]);

    if (user) {
        return <Navigate to='/' />
    }

    if (email === "") {
        return <Navigate to='/auth' />
    }

    return (
        <>
            <Header message='Welcome back to InstaChat'>
                <span>
                    Enter the One Time Password sent to you by email in order to authenticate to our website
                </span>
                {time > 0 ? <span>Resend OTP in {time} seconds</span> : <a 
                    onClick={(e) => { e.preventDefault(); generateOTP() }} 
                    href="#" 
                    className="text-balance text-center text-muted-foreground hover:underline hover:underline-offset-4 hover:text-primary">
                        Resend OTP
                    </a>}
            </Header>

            <AjaxForm 
                action='/auth/login'
                className="flex flex-col gap-6"
                onResponse={setUser}
                handleLoading={setLoading}
                onRequestError={onError}
            >
                <div className="grid gap-2">
                    <Label htmlFor='email'>Email</Label>
                    <div className={'flex gap-x-2'}>
                        <Input readOnly name={"email"} id="email" type="email" value={email || ''} required />
                        <Pencil className={'h-full'} onClick={() => navigate('/auth', { replace: true })} />
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

                <LoadingButton loading={loading} type={"submit"} className={"w-full"}>
                    Submit
                </LoadingButton>
            </AjaxForm>
        </>
    )
}