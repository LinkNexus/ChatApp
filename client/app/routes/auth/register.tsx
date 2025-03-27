import Header from "~/components/custom/auth/header";
import AjaxForm from "~/components/custom/forms/ajax-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Pencil } from "lucide-react";
import { useStore } from "~/store";
import { Navigate, useNavigate } from "react-router";
import LoadingButton from "~/components/custom/forms/loading-button";
import type { UserCreate } from "~/types";
import { useState } from "react";
import { ApiError } from "~/lib/custom/fetch";
import { formErrors } from "~/lib/custom/utils";

export default function () {
    const user = useStore.use.user();
    const email = useStore.use.email();
    const setUser = useStore.getState().setUser;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const { getError, hasError, clearError } = formErrors(error, setError);

    function handleResponse(response: UserCreate) {
        setUser({
            id: response.id,
            email: response.email,
            name: response.name,
            roles: response.roles,
            isVerified: response.isVerified,
        });
    }

    if (user) {
        return <Navigate to='/' />
    }


    if (email === "") {
        return <Navigate to="/auth" />;
    }

    return (
        <> 
            <Header message='Welcome to InstaChat'>
                Enter the required information to create an account
            </Header>

            <AjaxForm 
                className="flex flex-col gap-6" 
                action="/api/users"
                onResponse={handleResponse}
                onRequestError={setError}
                handleLoading={setLoading}
                ld
            >
                <div className="grid gap-2">
                    <Label htmlFor='email'>Email</Label>
                    <div className={'flex gap-x-2'}>
                        <Input onChange={() => clearError('email')} readOnly name={"email"} id="email" type="email" value={email || ''} required />
                        <Pencil className={'h-full'} onClick={() => navigate('/auth', { replace: true })} />
                    </div>
                    {hasError('email') && <span className="text-red-300 text-sm">{getError('email')}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input onChange={() => clearError('name')} className={hasError('name') ? 'border-red-500' : ''} name="name" autoFocus required placeholder="John Doe" />
                    {hasError('name') && <span className="text-red-500 text-sm">{getError('name')}</span>}
                </div>

                <LoadingButton loading={loading}>
                    Register
                </LoadingButton>
            </AjaxForm>
        </>
    )
}