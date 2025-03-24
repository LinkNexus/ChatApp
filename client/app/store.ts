import { create } from "zustand/react";
import { combine, persist } from "zustand/middleware";
import { createSelectors, isWindowDefined } from "./lib/custom/utils";
import type { User } from "./types";

export const useStore = createSelectors(
    create(
        persist(
            combine(
                {
                    user: undefined as User | null | undefined,
                    email: (function () {
                        if (isWindowDefined()) {
                            const accountJSON = localStorage.getItem("account");
                            if (accountJSON) {
                                return JSON.parse(accountJSON).email || '';
                            }

                            return '';
                        }
                    })()
                }, 
                (set) => ({
                    setUser: (user: User | null) => set({ user }),
                    setEmail: (email: string) => set({ email })
                })
            ),
            { name: "account" }
        )
    )
)