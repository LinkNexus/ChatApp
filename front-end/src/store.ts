import { createStore } from 'zustand';
import { combine, persist } from 'zustand/middleware';
import { User } from './types';

interface AppState {
    user: User | undefined | null;
    email: string;
}

interface AppActions {
    setUser: (user: User | null) => void;
    setEmail: (email: string) => void;
}

export type AppStore = AppState & AppActions;

const defaultInitState: AppState = {
    user: undefined as User | undefined | null,
    email: (function () {
        if (typeof window !== 'undefined') {
            const accountJSON = localStorage.getItem("instachat");
            if (accountJSON) {
                return JSON.parse(accountJSON).email || '';
            }
        }

        return '';
    })()
}

export const createAppStore = (
    initialState: AppState = defaultInitState
) => {
    return createStore(
        persist(
            combine(
                initialState,
                (set) => ({
                    setUser: (user: User | null) => ({ user: user }),
                    setEmail: (email: string) => ({ email })
                })
            ),
            {
                name: 'instachat'
            }
        )
    );
}