import { useAuth, AuthStatus } from "~/lib/custom/auth";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Navigate } from "react-router";
import { useEffect, type PropsWithChildren } from "react";

export default function ({ children }: PropsWithChildren) {
    const { status, authenticate } = useAuth();

    console.log(status);

    useEffect(() => {
        if (status === AuthStatus.Unknown) {
            authenticate();
        }
    }, [status])

    return (
        <>
            {status === AuthStatus.Unknown && (
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner size={50} />
                </div>
            )}
            {status === AuthStatus.Authenticated && children}
            {status === AuthStatus.Unauthenticated && <Navigate to="/auth" />}
        </>
    );
}