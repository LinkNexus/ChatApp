import { useEffect, type PropsWithChildren } from "react"
import { toast } from "sonner";
import { useApiFetch } from "~/lib/custom/fetch";

export type FlashKey = "error"|"info"|"success"|"warning";

export default function ({ children }: PropsWithChildren) {
    const { load } = useApiFetch<string[]|Record<FlashKey, string[]>>("/flash-messages", {
        method: "GET"
    });

    useEffect(() => {
        load().then(
            data => {
                if (Array.isArray(data)) return;

                for (const [type, messages] of Object.entries(data!)) {
                    for (const message of messages) {
                        toast[type as FlashKey](message, {
                            closeButton: true
                        });
                    }
                }
            }
        );
    }, []);

    return children;
}