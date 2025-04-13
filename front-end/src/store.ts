import { createStore } from 'zustand';
import { combine, createJSONStorage, persist } from 'zustand/middleware';
import { User } from './types';

interface AppState {
    email: string;
    otpTimeLeft: number;
}

interface AppActions {
    setEmail: (email: string) => void;
    setOTPTimeLeft: (timeLeft: number) => void;
}

export type AppStore = AppState & AppActions;

const defaultInitState: AppState = {
    email: '',
    otpTimeLeft: 0,
}

export const createAppStore = (
    initialState: AppState = defaultInitState
) => {
    return createStore(
        persist(
            combine(
                initialState,
                (set) => ({
                    setEmail: (email: string) => {
                        set((state) => ({
                            ...state,
                            email: email,
                        }))
                    },
                    setOTPTimeLeft: (timeLeft: number) => {
                        set((state) => ({
                            ...state,
                            otpTimeLeft: timeLeft,
                        }))
                    }
                })
            ),
            {
                name: 'instachat',
                storage: createJSONStorage(() => localStorage),
            }
        )
    );
}