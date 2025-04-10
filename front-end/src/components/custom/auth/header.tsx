import { MessageCircleCode } from "lucide-react";
import { PropsWithChildren, ReactNode } from "react";

export function AuthHeader ({ children, message }: PropsWithChildren<{ message: ReactNode }>) {
    return (
        <div className="flex flex-col items-center gap-2">
            <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                    <MessageCircleCode className="size-6" />
                </div>
                <span className="sr-only">InstaChat</span>
            </a>

            <h1 className="text-xl font-bold">{message}</h1>
            <div className="flex flex-col gap-y-3 text-center text-sm">
                {children}
            </div>
        </div>       
    );
}