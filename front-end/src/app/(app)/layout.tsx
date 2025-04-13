'use client';

import {PropsWithChildren, useEffect} from "react";
import {AuthStatus, useAuth} from "@/lib/custom/auth";
import {useRouter} from "next/navigation";
import {LoadingSpinner} from "@/components/ui/spinner";

export default function Layout ({ children }: PropsWithChildren) {
    const { authenticate, status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        authenticate();
    }, []);

    switch (status) {
        case AuthStatus.Unknown:
            return <div className='h-screen w-screen flex items-center justify-center'>
                <LoadingSpinner size={50} />
            </div>;
        case AuthStatus.Unauthenticated:
            router.push('/auth');
            break;
        case AuthStatus.Authenticated:
            return children;
    }
}