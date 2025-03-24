import { type User } from "~/types"
import { useStore } from "~/store";
import { useCallback } from "react";
import { ApiError, apiFetch } from "./fetch";


export enum AuthStatus {
    Unknown = 'unknown',
    Authenticated = 'authenticated',
    Unauthenticated = 'unauthenticated'
}

export function useAuth() {
    const user = useStore.use.user();
    const email = useStore.use.email();
    const setUser = useStore.getState().setUser;

    let status = AuthStatus.Unknown;

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

    const authenticate = useCallback(function () {
        apiFetch<User>("/auth/me").then(setUser).catch(() => setUser(null));
    }, [setUser]);

    const logout = useCallback(function () {
        apiFetch<User>("/auth/logout").then(() => setUser(null));
    }, [setUser]);

    const generateOTP = useCallback(function () {
        apiFetch<User>("/auth/generate-otp");
    }, [])

    return {
        user,
        status,
        authenticate,
        logout,
        generateOTP
    }
}

export function useAccount() {
    const {user} = useAuth();

    return {
        user: user!
    };
}