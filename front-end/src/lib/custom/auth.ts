import { User } from "@/types";
import {useCallback, useState} from "react";
import {apiFetch} from "./fetch";
import { useAppStore } from "@/store-provider";
import {toast} from "sonner";

export enum AuthStatus {
    Unknown = 'unknown',
    Authenticated = 'authenticated',
    Unauthenticated = 'unauthenticated'
}

export function useAuth() {
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const { setOTPTimeLeft, email } = useAppStore(state => state);
    let status: AuthStatus;

    switch (user) {
        case null:
            status = AuthStatus.Unauthenticated;
            break;
        case undefined:
            status = AuthStatus.Unknown;
            break;
        default:
            status = AuthStatus.Authenticated;
            break;
    }

    const authenticate = useCallback(async function () {
        try {
            setUser(await apiFetch<User>("/auth/me"));
        } catch (error) {
            setUser(null);
        }
    }, []);

    const logout = useCallback(async function (){
        await apiFetch<void>("/auth/logout");
        setUser(null);
    }, []);

    const generateOTP = useCallback(function () {
        apiFetch("/auth/token/generate", {
            data: {email}
        }).then(() => {
            setOTPTimeLeft(60);
            toast(`A new email was sent to ${email}`);
        })
    }, [setOTPTimeLeft, email]);

    return {
        status,
        user,
        setUser,
        authenticate,
        logout,
        generateOTP
    }
}

export function useAccount() {
    const { user, setUser } = useAuth();

    return {
        user: user!,
        setUser
    };
}